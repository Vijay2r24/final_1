import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatusBadge from "./Satus";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { TableFooter } from "@mui/material";
import axios from "axios";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterBar from "./FilterBar";
import StatusUpdateDialog from "../Orders/StatusUpdateDialog";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { OrderContext } from "../../Context/orderContext";
import { DataContext } from "../../Context/DataContext";

import { FaPlus, FaTable } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import Datepicker from "react-tailwindcss-datepicker";
import {
  GET_ALL_ORDERS,
  GETALLSTORES_API,
  GETORDERBYID_API,
  UPDATESUBORDERSTATUSAPI,
} from "../../Constants/apiRoutes";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import TablePagination from "@mui/material/TablePagination";
export default function Orders() {
  const [products, setProducts] = useState([]);
  const { setOrderIdDetails } = useContext(OrderContext);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  const [selectedFilter, setSelectedFilter] = useState({
    label: "All",
    subStatusId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [selectedStore, setSelectedStore] = useState({
    StoreID: "",
    StoreName: "Select Store",
  });
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });
  const handleOrderNumberChange = (e) => {
    setDetails({
      ...details,
      OrderNumber: e.target.value, // Update only the OrderNumber in the state
    });
  };
  const searchItems = (value) => {
    setSearchName(value);
  };
  const handleFilterChange = (filter) => {
    // Default filter: If the filter is not provided, default to 'All'
    const defaultFilter = { label: "All", subStatusId: "" };

    // Use the provided filter or fallback to default 'All' filter
    const selectedFilter = filter || defaultFilter;

    // Set selected filter state
    setSelectedFilter({
      label: selectedFilter.label,
      subStatusId: selectedFilter.subStatusId,
      status: selectedFilter.status,
    });

    // Log selected filter before making API call (optional)
    console.log("Selected Filter:", {
      label: selectedFilter.label,
      subStatusId: selectedFilter.subStatusId,
      status: selectedFilter.status,
    });

    // Get subStatusId or default to empty string if it's not provided
    const subStatusId = selectedFilter.subStatusId || "";

    // Make the API call to get filtered orders
    getAllOrders(1, 10, "", "", "", "", subStatusId)
      .then((response) => {
        // Log the entire API response to check structure
        console.log("API Response:", response);

        // Fetch totalCount from the response and log it
        const totalCount = response?.totalCount || 0;
        console.log("Total Count:", totalCount);

        // Update totalCount in state
        setTotalOrders(totalCount);

        // Handle the orders if needed
        const orders = response?.orders || [];
        console.log("Orders:", orders);
      })
      .catch((error) => {
        // Handle any errors that occur during the API call
        console.error("Error fetching orders:", error);
      });
  };
  const [totalCount, setTotalCount] = useState(0);
  const statuses = [
    { label: "All" }, // Added All label
    { label: "In Progress", count: "", status: "InProgress", subStatusId: 2 },
    { label: "Completed", count: "", status: "Completed", subStatusId: 3 },
    { label: "Cancelled", count: "", status: "Cancelled", subStatusId: 4 },
    { label: "Yet to Start", count: "", status: "YetToStart", subStatusId: 1 },
  ];
  const getAllOrders = async (
    pageNum,
    pageSize,
    search = "",
    storeID = "",
    startDate = "",
    endDate = "",
    subStatusId = "",
    selectedFilter = null // Added selectedFilter parameter
  ) => {
    try {
      const response = await axios.get(`${GET_ALL_ORDERS}`, {
        params: {
          page: pageNum + 1,
          pageSize: pageSize,
          searchText: search,
          StoreID: storeID,
          StartDate: startDate,
          EndDate: endDate,
          SubStatusId: subStatusId,
        },
      });

      const products = response.data.data;
      // Apply the selected filter logic
      const filteredOrders = products.filter((product) => {
        return (
          (!selectedFilter ||
            selectedFilter.label === "All" ||
            product.SubStatusId === selectedFilter.subStatusId) &&
          (!subStatusId || product.SubStatusId === subStatusId) &&
          product.OrderStatus === "Production"
        );
      });

      // Map the filtered orders to include the status label based on SubStatusId
      const ordersWithStatus = filteredOrders.map((order) => {
        const status = statuses.find(
          (s) => s.subStatusId === order.SubStatusId
        );
        return {
          ...order,
          statusLabel: status ? status.label : "Unknown", // Assign status label or 'Unknown' if not found
        };
      });
      console.log("Filtered Orders:", ordersWithStatus); // Log to see filtered orders
      return {
        orders: ordersWithStatus,
        totalCount: ordersWithStatus.length, // Total count of filtered orders
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };
  const fetchOrders = async () => {
    setLoading(true);
    console.log("Fetching orders..."); // Start fetching

    try {
      // Log the parameters being sent to the API
      console.log("API Parameters:", { page, rowsPerPage, searchName });

      const { orders, totalCount } = await getAllOrders(
        page,
        rowsPerPage,
        searchName,
        selectedStore.StoreID,
        value.startDate,
        value.endDate
      );

      // Log the result from the API
      console.log("Fetched orders:", orders);
      console.log("Total count from API:", totalCount);

      // Check the selectedFilter.subStatusId and log it
      console.log("Selected Filter subStatusId:", selectedFilter.subStatusId);

      // Filter orders based on subStatusId and log the filtered results
      const filteredOrders = selectedFilter.subStatusId
        ? orders.filter(
            (order) => order.SubStatusId === selectedFilter.subStatusId
          )
        : orders;

      console.log("Filtered orders:", filteredOrders);

      // Log the filter change handling
      console.log("Filter change handled");

      // Log final results before setting state
      setProducts(orders);
      console.log("Products set:", filteredOrders);

      setTotalOrders(filteredOrders.length);
      console.log("Total orders set:", filteredOrders.length);
    } catch (error) {
      // Log the error if fetching fails
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [
    page,
    rowsPerPage,
    searchName,
    selectedStore,
    value.startDate,
    value.endDate,
  ]);
  const handleStatusChange = (id, newStatus) => {
    setProducts((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Call API to update sub-order status
      const response = await axios.post(
        UPDATESUBORDERSTATUSAPI,
        {
          OrderID: details.OrderID,
          SubStatusId: details.SubStatusId,
        }
      );

      console.log("API Response:", response.data);

      // Show success toast notification
      toast.success("Order status updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Close dialog after success
      setOpenDialog(false);

      fetchOrders(); // Call fetchOrders to retrieve updated data setSelectedFilter({ label: selectedFilter.label, subStatusId: selectedFilter.subStatusId, status: selectedFilter.status });
    } catch (error) {
      console.error("API Call Error:", error);
      // Handle errors as needed
    }

    console.log("Updated Details:", details);

    // Reset loading state after 2 seconds
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const filteredOrders1 = products.filter(
    (product) =>
      !selectedFilter ||
      selectedFilter.label === "All" ||
      product.SubStatusId === selectedFilter.subStatusId
  );
  const paginatedData = filteredOrders1.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCancel = (id) => {
    const newStatus = "Canceled";
    handleStatusChange(id, newStatus);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOrderUpdate = (event, order) => {
    event.preventDefault();
    navigate("/update-order", { state: { order } });
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [details, setDetails] = useState({});

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setDetails(order); // Initialize details for editing
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="main-container">
      <ToastContainer />
      {loading && <LoadingAnimation />}
      <div>
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="heading">Production Orders</h2>
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
              onChange={(e) => searchItems(e.target.value)}
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
                  displayValue={(store) =>
                    store?.StoreName || "Select Store ID"
                  }
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
        <div className="flex flex-wrap">
          {/* Left Column (25%) */}
          <FilterBar
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            totalCount={totalCount}
          />
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/4 p-4">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Number
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Date
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Customer Info
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Delivery Info
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Order Status
                    </StyledTableCell>

                    <StyledTableCell
                      align="center"
                      sx={{
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        padding: "4px",
                        whiteSpace: "nowrap",
                      }}
                      className="font-semibold"
                    >
                      Updates
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={6} align="center">
                        {/* Display loading animation */}
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    paginatedData.map((product) => (
                      <StyledTableRow key={product.OrderID}>
                        <StyledTableCell className="text-xs text-center">
                          {product.OrderNumber}
                        </StyledTableCell>
                        <StyledTableCell className="text-xxs text-center">
                          {" "}
                          {/* Adjust size here */}
                          {product.OrderDate
                            ? (() => {
                                const date = new Date(product.OrderDate);
                                const month = date.toLocaleString("en-US", {
                                  month: "short",
                                });
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const year = date.getFullYear();
                                return `${month} ${day}, ${year}`;
                              })()
                            : "N/A"}{" "}
                          <span className="text-[10px] whitespace-nowrap">
                            {new Date(product.OrderDate)
                              .toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .toUpperCase()}
                          </span>
                          <br />
                          <div className="mt-1 text-gray-500 text-[10px] whitespace-nowrap">
                            Project: <strong>{product.Type || "N/A"}</strong>
                          </div>
                        </StyledTableCell>

                        <StyledTableCell align="left" className="text-xs">
                          <div className="text-[14px] whitespace-nowrap">
                            <span className="text-gray-500">Name: </span>
                            <strong>{product.CustomerName || "N/A"}</strong>
                          </div>

                          <div className="mt-1">
                            <span className="text-gray-500 text-xs">
                              Phone:{" "}
                            </span>
                            <span className="text-[10px]">
                              {product.Phone || "N/A"}
                            </span>{" "}
                            {/* Decreased font size here */}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell className="text-xs text-center">
                          {product.DeliveryDate
                            ? (() => {
                                const date = new Date(product.DeliveryDate);
                                const month = date.toLocaleString("en-US", {
                                  month: "short",
                                });
                                const day = String(date.getDate()).padStart(
                                  2,
                                  "0"
                                );
                                const year = date.getFullYear();
                                return `${month} ${day}, ${year}`;
                              })()
                            : "N/A"}
                          <br />
                          <div className="mt-1 text-gray-500 text-xs">
                            Amount: &#8377;{product.TotalAmount || "N/A"}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="center" className="text-xs">
                          <StatusBadge status={product.statusLabel} />
                          <br />
                          <div className="inline-flex items-center justify-center mt-1">
                            {product.OntimeorDelay === "1" ? (
                              <span className="inline-flex items-center bg-green-100 px-1 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-green-600 text-xs ml-1">
                                  <strong>On time</strong>
                                </span>
                              </span>
                            ) : product.OntimeorDelay === "2" ? (
                              <span className="inline-flex items-center bg-orange-100 px-1 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                <span className="text-orange-600 text-xs ml-1">
                                  <strong>Delay</strong>
                                </span>
                              </span>
                            ) : null}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <div className="flex justify-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleEditClick(product)}
                              className="text-xs button edit-button flex items-center"
                            >
                              <AiOutlineEdit
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                              Edit
                            </button>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 20, 25]}
                      colSpan={6}
                      count={totalOrders}
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
        </div>

        <StatusUpdateDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          item={{}} // You may need to pass the actual item or update this as needed
        />
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="xs" // Change this to a smaller size (xs, sm)
          fullWidth={false} // Set this to false for more control over width
          sx={{
            zIndex: 30,
            ml: "auto",
            "& .MuiDialog-paper": { width: "500px", maxHeight: "90vh" },
          }} // Set a specific width and max height
        >
          <DialogTitle
            sx={{ fontWeight: "bold", fontSize: "1.5rem", textAlign: "center" }}
          >
            Edit Production Details
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="OrderNumber"
              label="Order Number"
              type="text"
              fullWidth
              variant="outlined"
              value={details.OrderNumber || ""} // Display and allow editing of 'OrderNumber'
              onChange={(e) => handleOrderNumberChange(e)} // Handle change in OrderNumber
              sx={{ mb: 2 }}
              helperText="Enter the order number"
            />

            {/* Hidden input to pass OrderID to the backend */}
            <input
              type="hidden"
              name="OrderID"
              value={details.OrderID || ""} // Submit 'OrderID' without displaying it
            />
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="substatus-id-label">Production Status</InputLabel>
              <Select
                labelId="substatus-id-label"
                name="SubStatusId"
                value={details.SubStatusId || ""}
                onChange={handleChange}
                label="Production Status"
              >
                <MenuItem value="" disabled>
                  Select Production Status
                </MenuItem>
                <MenuItem value="1">Yet to Start</MenuItem>
                <MenuItem value="2">In Progress</MenuItem>
                <MenuItem value="3">Completed</MenuItem>
                <MenuItem value="4">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              onClick={handleSubmit}
              className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setOpenDialog(false)}
              className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
            >
              Cancel
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
