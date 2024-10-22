import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { FaTable } from "react-icons/fa";
import axios from "axios";
import { CustomerContext } from "../../Context/customerContext"; // Import CustomerContext
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Datepicker from "react-tailwindcss-datepicker";
import {
  GETALLCUSTOMERS_API,
  DELETECUSTOMERSBYID_API,
  GETALLCUSTOMERSBYID_API,
  GETALLSTORES_API,
  CUSTOMERID_API,
  ADDRESS_API,
  CUSTOMER_REPORT_API,
  ORDERBYCUSTOMERID_API,
} from "../../Constants/apiRoutes";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { GrFormView } from "react-icons/gr";
import { DataContext } from "../../Context/DataContext";

function Customers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [Customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const navigate = useNavigate();
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // const { setCustomerDetails } = useContext(CustomerContext);
  const { customerDetails, setCustomerDetails, setAddressDetails } =
    useContext(CustomerContext);
  const [isLoading, setIsLoading] = useState(false);

  // const [storeNames, setStoreNames] = useState([]);

  const [customers] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [orders, setOrders] = useState([]); // State to hold the fetched orders
  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const getAllCustomers = async (
    pageNum,
    pageSize,
    searchName,
    storeId,
    startDate,
    endDate
  ) => {
    console.log("Final API URL:", GETALLCUSTOMERS_API);

    try {
      const response = await axios.get(GETALLCUSTOMERS_API, {
        params: {
          page: pageNum + 1,
          pageSize: pageSize,
          limit: pageSize,
          SearchText: searchName,
          StoreID: storeId,
          StartDate: startDate,
          EndDate: endDate,
        },
      });

      return {
        customers: response.data.customers,
        totalCount: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };

  // Fetch customers from API
  const fetchCustomers = async () => {
    setIsLoading(true); // Set loading state to true before fetching data
    try {
      const { customers, totalCount } = await getAllCustomers(
        page,
        rowsPerPage,
        searchName,
        selectedStore?.StoreID,
        value.startDate,
        value.endDate
      );
      setCustomers(customers);
      setPaginatedPeople(customers);

      // Only update filtered customers if no search is active
      if (!isSearching) {
        setFilteredCustomers(customers); // Set initial filtered customers to all fetched data
      }

      setTotalCustomers(totalCount);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }
  };
  useEffect(() => {
    fetchCustomers(); // Fetch customers on component mount or whenever page/rowsPerPage changes
  }, [page, rowsPerPage, searchName, selectedStore, value]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getCustomerById = async (customerId) => {
    try {
      console.log("customers", customerId);
      const response = await axios.get(`${CUSTOMERID_API}/${customerId}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };
  const getCustomerAddressById = async (customerId) => {
    try {
      console.log("customers", customerId);
      const response = await axios.get(`${ADDRESS_API}/${customerId}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };

  const deleteCustomerById = async (customerId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        // `https://imlystudios-backend-mqg4.onrender.com/api/customers/deleteCustomer/${customerId}`

        `${DELETECUSTOMERSBYID_API}/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (customerId) => {
    setIsLoading(true); // Set loading state to true before fetching data
    try {
      const customerDetails = await getCustomerById(customerId);
      const addressDetails = await getCustomerAddressById(customerId);

      setCustomerDetails(customerDetails);
      setAddressDetails(addressDetails);
      navigate("/Customerform");
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }
  };
  // Handle delete button click
  const handleDeleteClick = async (customerId) => {
    setIsLoading(true); // Set loading state to true before deleting data
    try {
      await deleteCustomerById(customerId);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after deleting data
    }
  };
  const searchItems = (value) => {
    setSearchName(value);
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportCustomersData = async () => {
    setIsLoading(true);
    const url = CUSTOMER_REPORT_API; // New API endpoint

    // Define the request body (JSON format)
    const data = {
      StartDate: value.startDate,
      EndDate: value.endDate,
      StoreID: null, // Use selected store for ID
      ReferredBy: null,
    };

    try {
      // Make the POST request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is okay
      if (response.ok) {
        // Process response as a blob for the Excel file
        const blob = await response.blob();

        // Create a link element
        const link = document.createElement("a");
        // Set the blob URL as the href
        link.href = window.URL.createObjectURL(blob);
        // Set the download attribute with a filename
        link.download = "customer_report.xlsx"; // Adjust the filename as needed
        // Append the link to the body
        document.body.appendChild(link);
        // Programmatically click the link to trigger the download
        link.click();
        // Remove the link from the document
        link.remove();

        // Show success toast
        toast.success("Excel file downloaded successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const errorText = await response.text(); // Get the error message from the response
        console.error(
          "Failed to download the file:",
          response.status,
          response.statusText,
          errorText
        );

        // Parse the error text as JSON and extract the error message
        let errorMessage = "";
        try {
          const parsedError = JSON.parse(errorText);
          errorMessage = parsedError.error; // Access the error message
        } catch (e) {
          errorMessage = "An unexpected error occurred"; // Fallback error message
        }

        // Show error toast with backend message
        toast.error(`Failed to download the file: ${errorMessage}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error while fetching the report:", error);
      // Show error toast with error message
      toast.error(`Error while fetching the report: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsLoading(false);
  };

  const handleAddCustomerClick = () => {
    setCustomerDetails(null);
    navigate("/Customerform");
  };

  const handleViewOrdersClick = async (customerId) => {
    setIsLoading(true); // Set loading state to true before fetching data
    try {
      // Fetch orders for the selected customer
      const response = await axios.get(
        `${ORDERBYCUSTOMERID_API}/${customerId}`
      );
      const customerDetails = await getCustomerById(customerId);
      const addressDetails = await getCustomerAddressById(customerId);
      setCustomerDetails(customerDetails);
      setAddressDetails(addressDetails);

      // Assuming your response contains an array of orders
      setOrders(response.data); // Set the orders in state

      // Log fetched orders
      console.log("Fetched Orders:", response.data);

      // Navigate to the Customer form with activeStep state
      navigate("/Customerform", {
        state: { activeStep: 2, orders: response.data },
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle error, e.g., show a toast notification
    } finally {
      setIsLoading(false); // Set loading state to false after fetching data
    }
  };
  return (
    // <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:ml-10 lg:ml-72 w-auto">
    <div className="main-container">
      <ToastContainer />
      <div className="body-container">
        <h2 className="heading">Customers</h2>
        <div className="search-button-group">
          <ul className="button-list">
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleAddCustomerClick}
              >
                <FaPlus aria-hidden="true" className="icon" />
                Add Customers
              </button>
            </li>
            <li>
              <button
                type="button"
                className="action-button"
                onClick={handleExportCustomersData}
              >
                <FaTable aria-hidden="true" className="icon" />
                Export Customers
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-end items-center w-full gap-4">
        {/* Search input in the center with equal width */}
        <div className="search-container-c-u w-1/4">
          <div className="relative">
            <input
              id="searchName"
              type="text"
              placeholder="Search by Name or Email"
              value={searchName}
              onChange={(e) => searchItems(e.target.value)}
              className="search-input w-full pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <IoIosSearch className="text-gray-500" />
            </div>
          </div>
        </div>
        {/* Combobox on the right */}
        <div className="combobox-container w-1/4 flex justify-end">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper">
              <Combobox.Input
                className="combobox-input w-full h-10 px-3"
                displayValue={(store) => store?.StoreName || "Select Store ID"}
                placeholder="Select Store Name"
              />
              <Combobox.Button className="combobox-button">
                <ChevronUpDownIcon
                  className="combobox-icon"
                  aria-hidden="true"
                />
              </Combobox.Button>
              <Combobox.Options className="combobox-options">
                <Combobox.Option
                  key="select-store-id"
                  className={({ active }) =>
                    active ? "combobox-option-active" : "combobox-option"
                  }
                  value={{ StoreID: null, StoreName: "Select Store ID" }}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={
                          selected
                            ? "combobox-option-text font-semibold"
                            : "combobox-option-text font-normal"
                        }
                      >
                        Select Store ID
                      </span>
                      {selected && (
                        <span
                          className={
                            active
                              ? "combobox-option-selected-icon active-selected-icon"
                              : "combobox-option-selected-icon"
                          }
                        >
                          <CheckIcon
                            className="combobox-check-icon"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>

                {/* Render all store options */}
                {stores.map((store) => (
                  <Combobox.Option
                    key={store.StoreID}
                    className={({ active }) =>
                      active ? "combobox-option-active" : "combobox-option"
                    }
                    value={store}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={
                            selected
                              ? "combobox-option-text font-semibold"
                              : "combobox-option-text font-normal"
                          }
                        >
                          {store.StoreName}
                        </span>
                        {selected && (
                          <span
                            className={
                              active
                                ? "combobox-option-selected-icon active-selected-icon"
                                : "combobox-option-selected-icon"
                            }
                          >
                            <CheckIcon
                              className="combobox-check-icon"
                              aria-hidden="true"
                            />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
        </div>
        {/* Date picker on the right with equal width */}
        <div className="w-1/4">
          <div className="border-solid border-gray-400 border-[1px] rounded-lg w-full">
            <Datepicker
              popoverDirection="down"
              showShortcuts={true}
              showFooter={true}
              placeholder="Start Date and End Date"
              primaryColor={"purple"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: "25%" }}>Name</StyledTableCell>
              <StyledTableCell style={{ width: "20%" }}>Email</StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>
                Mobile No
              </StyledTableCell>
              <StyledTableCell style={{ width: "15%" }}>Gender</StyledTableCell>
              {/* <StyledTableCell style={{ width: "20%" }}>Actions</StyledTableCell> */}
              <StyledTableCell style={{ width: "20%" }} align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center"></StyledTableCell>
              </StyledTableRow>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((person, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <div className="flex items-center space-x-2">
                      <span>{person.CustomerFirstName}</span>
                      <span>{person.CustomerLastName}</span>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>{person.CustomerEmail}</StyledTableCell>
                  <StyledTableCell>{person.PhoneNumber}</StyledTableCell>
                  <StyledTableCell>
                    <span
                      className={`w-[68px] text-center gender-pill ${
                        person.Gender === "M"
                          ? "gender-male"
                          : person.Gender === "F"
                          ? "gender-female"
                          : "gender-na"
                      }`}
                    >
                      {person.Gender === null
                        ? "N/A"
                        : person.Gender === "M"
                        ? "Male"
                        : "Female"}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="button-container">
                      <button
                        type="button"
                        onClick={() => handleEditClick(person.CustomerID)}
                        className="button edit-button"
                      >
                        <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(person.CustomerID)}
                        className="button delete-button"
                      >
                        <MdOutlineCancel
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleViewOrdersClick(person.CustomerID);
                          setActiveStep(2);
                        }}
                        className="button view-button w-32 whitespace-nowrap" /* Prevents text from splitting */
                      >
                        <GrFormView aria-hidden="true" className="h-5 w-5" />
                        View Orders
                      </button>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  No customers found.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 25]}
                colSpan={6}
                count={totalCustomers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {isLoading && <LoadingAnimation />}
    </div>
    // </div>
  );
}

export default Customers;
