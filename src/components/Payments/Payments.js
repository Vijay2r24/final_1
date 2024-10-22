import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import { FaPlus, FaTable } from "react-icons/fa";
import * as XLSX from "xlsx";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { PaymentContext } from "../../Context/paymentContext";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import {
  GET_ALL_PAYMENTS_API,
  PAYMENT_REPORT_API,
} from "../../../src/Constants/apiRoutes";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { Combobox } from "@headlessui/react";
import { DataContext } from "../../Context/DataContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Datepicker from "react-tailwindcss-datepicker";
import CashIcon from "../../assests/Images/Payments/note.png";
import CreditCardIcon from "../../assests/Images/Payments/credit-card.svg";
import UpiIcon from "../../assests/Images/Payments/UPI-Color.svg";
import DebitCardIcon from "../../assests/Images/Payments/debit-card.svg";
import PaypalIcon from "../../assests/Images/Payments/paypal.svg";
import AmazonPayIcon from "../../assests/Images/Payments/amazon-pay.svg";
import { ToastContainer, toast } from "react-toastify";

function Payment() {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const { setPaymentDetails } = useContext(PaymentContext);
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const getAllPayments = async (
    pageNum,
    pageSize,
    search = "",
    storeID = "",
    startDate = "",
    endDate = ""
  ) => {
    try {
      const response = await axios.get(`${GET_ALL_PAYMENTS_API}`, {
        params: {
          page: pageNum + 1,
          pageSize: pageSize,
          searchText: search,
          StoreID: storeID,
          StartDate: startDate,
          EndDate: endDate,
        },
      });
      return {
        payments: response.data.data,
        totalCount: response.data.totalRecords,
      };
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const { payments, totalCount } = await getAllPayments(
        page,
        rowsPerPage,
        searchName,
        selectedStore.StoreID,
        value.startDate,
        value.endDate
      );
      setPayments(payments);
      setTotalPayments(totalCount);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleExportPaymentsData = async () => {
    setIsLoading(true);
    const url = PAYMENT_REPORT_API; // API endpoint

    // Define the request body (JSON format)
    const data = {
      StartDate: value.startDate,
      EndDate: value.endDate,
      StoreID: null,
      OrderID: null,
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
        // Set the download attribute with a filename (e.g., "payment_report.xlsx")
        link.download = "payment_report.xlsx"; // Adjust the filename as needed
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

  useEffect(() => {
    fetchPayments();
  }, [
    page,
    rowsPerPage,
    searchName,
    selectedStore,
    value.startDate,
    value.endDate,
  ]);

  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case "Cash":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={CashIcon} alt="Cash Icon" />
          </div>
        );
      case "Credit Card":
        return (
          <div className="rounded-full pt-2">
            <img className="w-10 h-8" src={CreditCardIcon} alt="Cash Icon" />
          </div>
        );
      case "UPI" || "upi":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={UpiIcon} alt="Cash Icon" />
          </div>
        );
      case "AmazonPay" || "Amazonpay":
        return (
          <div className=" rounded-full ">
            <img className="w-10 h-10 " src={AmazonPayIcon} alt="Cash Icon" />
          </div>
        );
      case "Amazon Pay":
        return (
          <div className=" rounded-full ">
            <img className="w-10 h-10 " src={AmazonPayIcon} alt="Cash Icon" />
          </div>
        );
      case "PayPal":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={PaypalIcon} alt="Cash Icon" />
          </div>
        );
      case "Paypal":
        return (
          <div className="rounded-full ">
            <img className="w-10 h-10" src={PaypalIcon} alt="Cash Icon" />
          </div>
        );
      case "Debit Card":
        return (
          <div className="rounded-full pt-2 ">
            <img className="w-10 h-8" src={DebitCardIcon} alt="Cash Icon" />
          </div>
        );

      default:
        return (
          <div>
            <strong>N/A</strong>
          </div>
        );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddPaymentClick = () => {
    setPaymentDetails(null);
    navigate("/Paymentsform"); // Make sure this matches the route path defined
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="main-container">
      <ToastContainer />
      <div className="body-container">
        <h2 className="heading">Payments</h2>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="search-button-group">
            <ul className="button-list">
              <li>
                <button
                  type="button"
                  className="action-button"
                  onClick={handleAddPaymentClick}
                >
                  <FaPlus aria-hidden="true" className="icon" />
                  Add Payments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="action-button"
                  onClick={handleExportPaymentsData}
                >
                  <FaTable aria-hidden="true" className="icon" />
                  Export Payments
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {/* Container for centering search box */}
        <div className="search-container-c-u">
          <label htmlFor="searchName" className="sr-only">
            Search
          </label>
          <input
            id="searchName"
            type="text"
            placeholder=" Search by Order Number / Customer Name "
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="mt-1 p-1 pr-10 border border-gray-400 rounded-md w-full sm:w-64 text-sm leading-6 h-[40px]"
          />
          <div className="search-icon-container-c-u">
            <IoIosSearch />
          </div>
        </div>

        {/* Container for Combo box */}
        <div className="combobox-container flex items-center">
          <Combobox value={selectedStore} onChange={setSelectedStore}>
            <div className="combobox-wrapper h-[40px]">
              <Combobox.Input
                className="combobox-input w-full h-full"
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
                {/* Add "Select Store ID" option */}
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
        {/* Container for Date Pickers */}
        <div className="flex justify-center items-center gap-4 w-full p-2 sm:w-auto md:w-80 text-sm leading-6">
          <div className="border-solid border-gray-400 w-full border-[1px] rounded-lg">
            <Datepicker
              popoverDirection="down"
              showShortcuts={true}
              showFooter={true}
              placeholder="Start Date and End Date"
              primaryColor={"purple"}
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </div>
        </div>
      </div>
      {isLoading && <LoadingAnimation />}
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell>Payment Date</StyledTableCell>
              <StyledTableCell>Order Number</StyledTableCell>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Paid Amount &nbsp;( &#8377; )</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <StyledTableRow key={payment.PaymentID}>
                <StyledTableCell>
                  <div className="flex flex-col md:flex-col lg:flex-row items-center lg:space-x-2 space-y-2 lg:space-y-0 w-full">
                    {getPaymentMethodIcon(payment.PaymentMethod)}
                    <div className="flex flex-col  sm:flex-row sm:space-x-2  w-full md:pr-8 lg:pr-8">
                      {payment.PaymentMethod}
                    </div>
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  {payment.PaymentDate
                    ? (() => {
                        const date = new Date(payment.PaymentDate);
                        const month = date.toLocaleString("en-US", {
                          month: "short",
                        });
                        const day = String(date.getDate()).padStart(2, "0"); // Pad single-digit day
                        const year = date.getFullYear();

                        return `${month} ${day}, ${year}`;
                      })()
                    : "N/A"}{" "}
                  {new Date(payment.PaymentDate)
                    .toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .toUpperCase()}
                </StyledTableCell>
                <StyledTableCell>
                  {payment.OrderNumber ?? "Not available"}
                </StyledTableCell>
                <StyledTableCell>
                  {payment.CustomerName ?? "Not available"}
                </StyledTableCell>
                <StyledTableCell>
                  {payment.Amount ? payment.Amount : "N/A"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 25]}
                colSpan={6}
                count={totalPayments}
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
    </div>
  );
}

export default Payment;
