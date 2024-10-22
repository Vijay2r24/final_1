import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomerContext } from "../../Context/customerContext";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Combobox } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  CREATEORUPDATE_CUSTOMERS_API,
  CREATEORUPDATE_CUSTOMERS_ADDRESS_API,
  DELETE_CUSTOMERS_ADDRESS_API,
  ORDERBYCUSTOMERID_API,
  ADDRESS_API,
} from "../../Constants/apiRoutes";
import { MdOutlineCancel } from "react-icons/md";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import SuccessPopup from "../SuccessPopup";
import { showSuccessToast, showErrorToast } from "../../toastNotifications";
import { DataContext } from "../../Context/DataContext";

const steps = ["Customer Details", "Address", "Orders"];
const genderOptions = [
  { id: "M", name: "Male" },
  { id: "F", name: "Female" },
];
const referralOptions = ["Social Media", "Walk-In", "Reference"]; // Referral options

function AddCustomers() {
  const navigate = useNavigate();
  const location = useLocation();
  // const { customerDetails } = useContext(CustomerContext);
  const { customerDetails, addressDetails } = useContext(CustomerContext);

  const [ReferedBy, setReferedBy] = useState(null);

  const [SubReference, setSubReference] = useState(null);
  const [selectedSocialMediaPlatform, setSelectedSocialMediaPlatform] =
    useState(null);

  const [query, setQuery] = useState("");

  const handleSubReferenceChange = (option) => {
    setSubReference(option);
    setCustomerFormData({ ...customerFormData, SubReference: option });
  };

  const handleSocialMediaPlatformChange = (platform) =>
    setSelectedSocialMediaPlatform(platform);
  const handleRefereeNameChange = (e) =>
    setCustomerFormData({ ...customerFormData, refereeName: e.target.value });

  const isEditMode = Boolean(
    location.state?.customerDetails?.customer || customerDetails?.customer
  );

  // Customer form data state
  const [customerFormData, setCustomerFormData] = useState({
    TenantID: 1,
    CustomerID: 0,
    StoreID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    Gender: "",
    Comments: "",
    Alternative_PhoneNumber: "",
    ReferedBy: "",
    SubReference: "",
  });

  const [addressFormData, setAddressFormData] = useState({
    AddressID: 0,
    CustomerID: "",
    TenantID: 1,
    AddressLine1: "",
    AddressLine2: "",
    CityID: "",
    StateID: "",
    CountryID: "",
    ZipCode: "",
    Addresses: [],
  });
  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const [error, setError] = useState("");
  const [selectedGender, setSelectedGender] = useState(
    customerFormData.Gender || ""
  );
  const [activeStep, setActiveStep] = useState(0);

  const [countryMap, setCountryMap] = useState({});
  const [setStateMap] = useState({});
  const [setCityMap] = useState({});
  const [Addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [addressTableData, setAddressTableData] = useState([]);

  const [popupMessage, setPopupMessage] = useState(""); // For pop-up message
  const [showPopup, setShowPopup] = useState(false);

  const { citiesData, statesData, countriesData } = useContext(DataContext);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (countriesData && statesData && citiesData) {
      setCountries(countriesData.data || []);
      setStates(statesData.data || []);
      setCities(citiesData.data || []);
    }
  }, [countriesData, statesData, citiesData]);

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  console.log(stores);

  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  useEffect(() => {
    console.log("customerDetails from context:", customerDetails);
    console.log("addressDetails from context:", addressDetails);

    if (isEditMode) {
      const customer =
        location.state?.customerDetails?.customer || customerDetails?.customer;

      // Set customer form data
      setCustomerFormData({
        TenantID: customer?.TenantID || 1,
        CustomerID: customer?.CustomerID || 0,
        StoreID: customer?.StoreID || "",
        FirstName: customer?.FirstName || "",
        LastName: customer?.LastName || "",
        Email: customer?.Email || "",
        Password: customer?.Password || "",
        ConfirmPassword: "",
        PhoneNumber: customer?.PhoneNumber || "",
        Gender: customer?.Gender || "",
        Comments: customer?.Comments || "",
        Alternative_PhoneNumber: customer?.Alternative_PhoneNumber || "",
        ReferedBy: customer?.ReferedBy || "",
        SubReference: customer?.SubReference || "",
      });

      // Set the selected referral type in edit mode
      const selectedReferral = referralOptions.find(
        (referral) => referral === customer?.ReferedBy
      );
      setReferedBy(selectedReferral || "");

      // Set the selected SubReference in edit mode
      const selectedSubReference = ["Director", "Employee", "Existing"].find(
        (option) => option === customer?.SubReference
      );
      setSubReference(selectedSubReference || "");

      if (!selectedSubReference) {
        const socialMediaPlatforms = ["Facebook", "Instagram", "Twitter"];
        const selectedSocialMediaPlatform = socialMediaPlatforms.find(
          (platform) => platform === customer?.SubReference
        );
        setSubReference(selectedSocialMediaPlatform || "");
      } else {
        setSubReference(selectedSubReference || "");
      }

      const selectedStore = stores.find(
        (store) => store.StoreID === customer?.StoreID
      );
      console.log(selectedStore, "Sstore");
      setSelectedStore(selectedStore || null);

      // Set the selected gender
      const selectedGender = genderOptions.find(
        (gender) => gender.id === customer?.Gender
      );
      setSelectedGender(selectedGender || "");

      const firstAddress = location.state?.addressDetails || addressDetails;
      console.log("firstAddress ", firstAddress);

      if (firstAddress?.Addresses && Array.isArray(firstAddress.Addresses)) {
        setAddressTableData(firstAddress.Addresses);
      }

      // Set the selected country, state, and city based on the first address
      setSelectedCountry(firstAddress?.Addresses?.[0]?.CountryID || null);
      setSelectedState(firstAddress?.Addresses?.[0]?.StateID || null);
      setSelectedCity(firstAddress?.Addresses?.[0]?.CityID || null);

      // Set customer ID
      setCustomerId(customer?.CustomerID || 0);

      // Set customer ID
      setCustomerId(customer?.CustomerID || 0);
    } else {
      // Clear data when not in edit mode
      setCustomerFormData({
        TenantID: 1,
        CustomerID: 0,
        StoreID: "",
        CustomerFirstName: "",
        CustomerLastName: "",
        CustomerEmail: "",
        Password: "",
        ConfirmPassword: "",
        PhoneNumber: "",
        Gender: "",
        Comments: "",
        ReferedBy: "",
      });

      setAddressFormData({
        CustomerID: 0,
        AddressID: 0,
        AddressLine1: "",
        AddressLine2: "",
        CityID: "",
        StateID: "",
        CountryID: "",
        ZipCode: "",
        Addresses: [],
      });

      setAddressTableData([]);
      setSelectedCountry(null);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [
    isEditMode,
    location.state?.customerDetails?.customer,
    customerDetails?.customer,
    addressDetails,
    genderOptions,
    stores,
  ]);
  const handleReferralTypeChange = (type) => {
    setReferedBy(type); // Set the selected referral type
    setCustomerFormData({ ...customerFormData, ReferedBy: type });
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setCustomerFormData({ ...customerFormData, Gender: gender.id });
  };

  const handleCustomerFormChange = (e) => {
    const { name, value } = e.target;
    setCustomerFormData({
      ...customerFormData,
      [name]: value,
    });
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData({
      ...addressFormData,
      [name]: value,
    });
  };

  const [customerId, setCustomerId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  const handleCustomerFormSubmit = async () => {
    setIsLoading(true); // Show loading animation
    const customerApiUrl = CREATEORUPDATE_CUSTOMERS_API;

    try {
      console.log("Customer Form Data:", customerFormData);

      // Create or update the customer
      const customerResponse = await axios.post(
        customerApiUrl,
        customerFormData
      );
      console.log("Customer Response:", customerResponse);

      const newCustomerId = customerResponse.data.CustomerID;

      if (!newCustomerId) {
        throw new Error("Failed to retrieve CustomerID from response.");
      }

      setCustomerId(newCustomerId);
      console.log("Customer ID has been set:", newCustomerId);

      // Show success toast notification
      if (customerFormData.CustomerID) {
        toast.success("Customer Details Updated successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.success("Customer Details Added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      handleNext();
      return newCustomerId;
    } catch (error) {
      console.error("Customer submission failed:", error);

      // Show error toast notification
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(
          `Failed to ${
            customerFormData.CustomerID ? "update" : "create"
          } customer: ` + error.response.data.message,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleFinish = () => {
    navigate("/Customer");
  };

  const handleAddressFormSubmit = async (customerId) => {
    setIsLoading(true); // Show loading animation
    const addressesApiUrl = CREATEORUPDATE_CUSTOMERS_ADDRESS_API;

    try {
      console.log("Address FormData", addressFormData);
      const newAddress = {
        AddressID: addressFormData.AddressID || 0, // Default to 0 for new addresses
        AddressLine1: addressFormData.AddressLine1 || "",
        AddressLine2: addressFormData.AddressLine2 || "",
        CityID: addressFormData.CityID || "",
        StateID: addressFormData.StateID || "",
        CountryID: addressFormData.CountryID || "",
        ZipCode: addressFormData.ZipCode || "",
      };

      // Create updated addresses array
      const updatedAddresses = addressFormData.Addresses
        ? [...addressFormData.Addresses, newAddress]
        : [newAddress];

      // Update addressFormData with the new addresses
      setAddressFormData((prevState) => ({
        ...prevState,
        Addresses: updatedAddresses,
      }));

      console.log("Updated Addresses Array:", updatedAddresses);

      const addressData = {
        Addresses: updatedAddresses,
        AddressID: newAddress.AddressID,
        CustomerID: customerId,
        TenantID: 1,
        AddressLine1: newAddress.AddressLine1,
        AddressLine2: newAddress.AddressLine2,
        CityID: newAddress.CityID,
        StateID: newAddress.StateID,
        CountryID: newAddress.CountryID,
        ZipCode: newAddress.ZipCode,
      };

      console.log("Final Address Data for Submission:", addressData);

      // Send the address data to the API
      const addressResponse = await axios.post(addressesApiUrl, addressData);
      console.log("Address Response:", addressResponse.data);

      // Show success toast notification
      const isUpdating = Boolean(addressFormData.AddressID); // Check if updating an existing address
      const successMessage = isUpdating
        ? "Address Updated successfully!"
        : "Address Added successfully!";

      toast.success(successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Fetch updated customer data after successful submission
      const updatedCustomer = await getCustomerAddressById(customerId);
      console.log("Updated Customer:", updatedCustomer);

      if (updatedCustomer && Array.isArray(updatedCustomer)) {
        console.log("Setting address table data:", updatedCustomer);
        setAddressTableData(updatedCustomer); // Set updated addresses in the table
      }

      // Set the selected country, state, and city
      setSelectedCountry(updatedCustomer?.Addresses?.[0]?.CountryID || null);
      setSelectedState(updatedCustomer?.Addresses?.[0]?.StateID || null);
      setSelectedCity(updatedCustomer?.Addresses?.[0]?.CityID || null);

      // Reset form fields
      setAddressFormData({
        AddressID: 0,
        AddressLine1: "",
        AddressLine2: "",
        CityID: "",
        StateID: "",
        CountryID: "",
        ZipCode: "",
        Addresses: [],
      });
    } catch (error) {
      console.error("Error submitting address:", error);

      // Show error toast notification
      if (error.response) {
        console.error("Response data:", error.response.data);
        toast.error(
          "Failed to submit address: " + error.response.data.message,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response received from server.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  useEffect(() => {
    console.log("Address table data updated:", addressTableData);
  }, [addressTableData]);

  const getCustomerAddressById = async (customerId) => {
    try {
      console.log("Fetching addresses for customer ID:", customerId);
      const response = await axios.get(`${ADDRESS_API}/${customerId}`);

      // Assuming the response contains an array of addresses
      const addressData = response.data?.Addresses || []; // Adjust based on your API response structure

      // Set address data in state
      setAddressTableData({
        Addresses: addressData,
      });

      return addressData; // Optionally return the addresses if needed
    } catch (error) {
      console.error("Error fetching customer addresses:", error);
      throw error; // Re-throw the error for further handling if necessary
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = customerFormData.CustomerID;
        console.log(customerId);

        if (!customerId) return; // Ensure customerId exists

        const response = await axios.get(
          `${ORDERBYCUSTOMERID_API}/${customerId}`
        );
        setOrders(response.data.orders || []);
        console.log("Fetched Orders:", response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    // Only call fetchOrders if customerId exists
    if (customerFormData.CustomerID) {
      fetchOrders();
    }
  }, [customerFormData.CustomerID]); // Watch for changes in formData.CustomerID

  const handleCountryChange = (selectedCountry) => {
    if (!selectedCountry) return;

    const countryID =
      countryMap[selectedCountry.CountryName] || selectedCountry.CountryID;

    setSelectedCountry(selectedCountry);
    setAddressFormData({
      ...addressFormData,
      CountryID: countryID,
      CountryName: selectedCountry.CountryName,
    });
    setSelectedState("");
    setSelectedCity("");
    setFilteredStates(
      states.filter((state) => state.CountryID === selectedCountry.CountryID)
    );
  };

  const handleStateChange = (state) => {
    if (!state) return;

    const stateID = stateMap[state.StateName] || state.StateID;

    setSelectedState(state);
    setSelectedCity("");
    setAddressFormData({
      ...addressFormData,
      StateID: stateID,
      StateName: state.StateName,
    });
    setFilteredCities(cities.filter((city) => city.StateID === state.StateID));
  };

  const handleCityChange = (city) => {
    if (!city) return;

    const cityID = cityMap[city.CityName] || city.CityID;

    setSelectedCity(city);
    setAddressFormData({
      ...addressFormData,
      CityID: cityID,
      CityName: city.CityName,
    });
  };

  const handleReset = () => {
    setActiveStep(0);

    // Reset customer form data
    setCustomerFormData({
      TenantID: 1,
      CustomerID: null,
      CustomerFirstName: "",
      CustomerLastName: "",
      CustomerEmail: "",
      Password: "",
      ConfirmPassword: "",
      PhoneNumber: "",
      Gender: "",
      Comments: "",
      Alternative_PhoneNumber: "",
      ReferedBy: "",
    });

    // Reset address form data
    setAddressFormData({
      AddressLine1: "",
      AddressLine2: "",
      CityID: "",
      StateID: "",
      CountryID: "",
      ZipCode: "",
    });
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => false;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = async (addressId) => {
    console.log(addressId);

    // Find the selected address using the AddressID directly from the array
    const selectedAddress = addressTableData.find(
      (address) => address.AddressID === addressId
    );

    if (selectedAddress) {
      // Find the corresponding country, state, and city based on their IDs
      const selectedCountry =
        countries.find(
          (country) => country.CountryID === selectedAddress.CountryID
        ) || {};
      const selectedState =
        states.find((state) => state.StateID === selectedAddress.StateID) || {};
      const selectedCity =
        cities.find((city) => city.CityID === selectedAddress.CityID) || {};

      // Populate the form fields with the selected address details
      setAddressFormData((prevState) => ({
        ...prevState,
        AddressID: selectedAddress.AddressID || 0,
        CustomerID: prevState.CustomerID, // Keep the same customer ID
        AddressLine1: selectedAddress.AddressLine1 || "",
        AddressLine2: selectedAddress.AddressLine2 || "",
        CityID: selectedAddress.CityID || "",
        StateID: selectedAddress.StateID || "",
        CountryID: selectedAddress.CountryID || "",
        ZipCode: selectedAddress.ZipCode || "",
        Addresses: prevState.Addresses, // Keep the existing array of addresses
      }));

      // Set the country, state, and city dropdowns
      setSelectedCountry(selectedCountry);
      setSelectedState(selectedState);
      setSelectedCity(selectedCity);

      console.log("Editing Address Data:", selectedAddress);
    } else {
      console.error("Address with the specified AddressID not found.");
    }
  };

  const handleDelete = async (addressId, customerId) => {
    console.log("AddressID to delete:", addressId);

    if (!addressId) {
      console.error("No AddressID provided.");
      return;
    }

    const deleteApiUrl = `${DELETE_CUSTOMERS_ADDRESS_API}/${addressId}`;

    try {
      // Make a DELETE request to the API
      const response = await axios.delete(deleteApiUrl);

      console.log("Delete Response:", response.data);

      // Remove the deleted address from the addressFormData state
      setAddressFormData((prevState) => ({
        ...prevState,
        Addresses: prevState.Addresses.filter(
          (address) => address.AddressID !== addressId
        ),
      }));

      console.log("Address deleted successfully.");

      // Show success toast notification
      toast.success("Address deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const updatedCustomer = await getCustomerAddressById(customerId);
      console.log("Updated Customer:", updatedCustomer);

      if (updatedCustomer && Array.isArray(updatedCustomer)) {
        console.log("Setting address table data:", updatedCustomer);
        setAddressTableData(updatedCustomer); // Set updated addresses in the table
      }
    } catch (error) {
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleCancel = () => {
    setIsLoading(true);

    // Add a small delay before navigating to show the loader
    setTimeout(() => {
      navigate("/Customer");
    }, 1500); // Delay by 500ms
  };

  const handleStoreChange = (store) => {
    if (!store || !store.StoreID) {
      console.error("Invalid store selected:", store);
      return;
    }

    setSelectedStore(store);
    console.log("Selected Store ID:", store.StoreID);

    // Update formData with selected store ID and name
    setCustomerFormData({
      ...customerFormData,
      StoreID: store.StoreID, // Store ID to send to the backend
    });
  };
  useEffect(() => {
    // Check if there's state passed to this component
    if (location.state) {
      setActiveStep(location.state.activeStep || 0); // Set the active step from location state
      setOrders(location.state.orders || []); // Set orders if available from location state
    }
  }, [location.state]);

  const cityMap = cities.reduce((acc, city) => {
    acc[city.CityID] = city.CityName;
    return acc;
  }, {});

  const stateMap = states.reduce((acc, state) => {
    acc[state.StateID] = state.StateName;
    return acc;
  }, {});

  return (
    <>
      <div className="main-container">
        <ToastContainer />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} className="mb-6" alternativeLabel>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {
                onClick: () => handleStepClick(index), // Add onClick handler
                style: { cursor: "pointer" }, // Add cursor style for pointer
              };

              if (isStepOptional(index)) {
                // Optional step logic
              }

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length ? (
            <React.Fragment></React.Fragment>
          ) : (
            <React.Fragment>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr" },
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  pt: 2,
                }}
              >
                {activeStep === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center gap-4 w-full">
                      <label
                        htmlFor="storeName"
                        className="w-1/3 text-xs font-medium text-gray-700"
                      >
                        Store Name
                      </label>
                      <Combobox
                        value={selectedStore}
                        onChange={handleStoreChange}
                        className="w-full"
                      >
                        <div className="relative mt-1">
                          <Combobox.Input
                            id="storeName"
                            className={`p-1 w-full border rounded-md ${
                              error ? "border-red-500" : "border-gray-400"
                            }`}
                            displayValue={(store) => store?.StoreName || ""}
                            placeholder="Select Store"
                          />

                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {stores.map((store) => (
                              <Combobox.Option
                                key={store.StoreID} // Use StoreID as the key
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={store}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {store.StoreName}{" "}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
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
                    <div></div>
                    {/* First Name */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="FirstName"
                        value={customerFormData.FirstName}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    {/* Last Name */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="LastName"
                        value={customerFormData.LastName}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="PhoneNumber"
                        value={customerFormData.PhoneNumber}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    {/* Email */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={customerFormData.Email}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Alternate Phone Number
                      </label>
                      <input
                        type="text"
                        name="Alternative_PhoneNumber"
                        value={customerFormData.Alternative_PhoneNumber}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    {/* Password */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        name="Password"
                        value={customerFormData.Password}
                        onChange={handleCustomerFormChange}
                        className={`p-1 w-full border rounded-md ${
                          error ? "border-red-500" : "border-gray-400"
                        }`}
                      />
                    </div>
                    {/* Gender */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Gender
                      </label>
                      <Combobox
                        value={selectedGender}
                        onChange={handleGenderChange}
                      >
                        <div className="relative w-full">
                          <Combobox.Input
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            displayValue={(type) => (type ? type.name : "")}
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {genderOptions.map((gender) => (
                              <Combobox.Option
                                key={gender.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  }`
                                }
                                value={gender}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected
                                          ? "font-semibold"
                                          : "font-normal"
                                      }`}
                                    >
                                      {gender.name}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
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
                    <div className="flex flex-col gap-4">
                      {/* Referred By Field */}
                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Referred By
                        </label>
                        <div className="w-full">
                          <Combobox
                            as="div"
                            value={ReferedBy}
                            onChange={handleReferralTypeChange}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                }
                                displayValue={(type) => type || ""}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {["Social Media", "Walk-In", "Reference"].map(
                                  (type, index) => (
                                    <Combobox.Option
                                      key={index}
                                      value={type}
                                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    >
                                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {type}
                                      </span>
                                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Combobox.Option>
                                  )
                                )}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                        </div>
                      </div>

                      {/* Conditional Rendering for Reference */}
                      {ReferedBy === "Reference" && (
                        <div className="flex flex-col gap-4">
                          {/* Reference Sub-option */}
                          <div className="flex items-center gap-4">
                            <label className="w-1/3 text-xs font-medium text-gray-700">
                              Reference Sub-option
                            </label>
                            <div className="w-full">
                              <Combobox
                                as="div"
                                value={SubReference}
                                onChange={handleSubReferenceChange}
                              >
                                <div className="relative">
                                  <Combobox.Input
                                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                    onChange={(event) =>
                                      setQuery(event.target.value)
                                    }
                                    displayValue={(option) => option || ""}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {["Director", "Employee", "Existing"].map(
                                      (option, index) => (
                                        <Combobox.Option
                                          key={index}
                                          value={option}
                                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                        >
                                          <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                            {option}
                                          </span>
                                          <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Combobox.Option>
                                      )
                                    )}
                                  </Combobox.Options>
                                </div>
                              </Combobox>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Conditional Rendering for Social Media */}
                      {ReferedBy === "Social Media" && (
                        <div className="flex flex-col gap-4">
                          {/* Social Media Platform */}
                          <div className="flex items-center gap-4">
                            <label className="w-1/3 text-xs font-medium text-gray-700">
                              Social Media Platform
                            </label>
                            <div className="w-full">
                              <Combobox
                                as="div"
                                value={SubReference}
                                onChange={handleSubReferenceChange}
                              >
                                <div className="relative">
                                  <Combobox.Input
                                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                    onChange={(event) =>
                                      setQuery(event.target.value)
                                    }
                                    displayValue={(platform) => platform || ""}
                                  />
                                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                    <ChevronUpDownIcon
                                      className="h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </Combobox.Button>

                                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {["Facebook", "Instagram", "Twitter"].map(
                                      (platform, index) => (
                                        <Combobox.Option
                                          key={index}
                                          value={platform}
                                          className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                        >
                                          <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                            {platform}
                                          </span>
                                          <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Combobox.Option>
                                      )
                                    )}
                                  </Combobox.Options>
                                </div>
                              </Combobox>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {error && (
                        <p className="mt-2 text-red-600 text-xs">{error}</p>
                      )}
                    </div>
                    {/* Comments */}
                    <div className="flex items-center gap-4">
                      <label className="w-1/3 text-xs font-medium text-gray-700">
                        Comments
                      </label>
                      <textarea
                        name="Comments"
                        value={customerFormData?.Comments || ""}
                        onChange={handleCustomerFormChange}
                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        rows="3"
                      />
                    </div>
                    <div></div>
                    <div></div>{" "}
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={handleCustomerFormSubmit}
                      >
                        {customerFormData.CustomerID ? "Update" : "Save"}{" "}
                        {/* Conditional button text */}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    </div>
                    {showPopup && (
                      <SuccessPopup
                        message={popupMessage}
                        onClose={() => setShowPopup(false)}
                      />
                    )}
                    {isLoading && <LoadingAnimation />}
                  </div>
                )}
                {activeStep === 1 && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          name="AddressLine1"
                          value={addressFormData.AddressLine1}
                          onChange={handleAddressFormChange}
                          className={`p-1 w-full border rounded-md ${
                            error ? "border-red-500" : "border-gray-400"
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="AddressLine2"
                          value={addressFormData.AddressLine2}
                          onChange={handleAddressFormChange}
                          className={`p-1 mt-2 mb-1 w-full border rounded-md ${
                            error ? "border-red-500" : "border-gray-400"
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Country
                        </label>
                        <div className="w-full">
                          <Combobox
                            as="div"
                            value={selectedCountry}
                            onChange={handleCountryChange}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                } // Set the query for filtering
                                displayValue={(country) =>
                                  country?.CountryName || ""
                                } // Display selected country name
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {countries
                                  .filter((country) =>
                                    country.CountryName.toLowerCase().includes(
                                      query.toLowerCase()
                                    )
                                  )
                                  .map((country) => (
                                    <Combobox.Option
                                      key={country.CountryID}
                                      value={country} // Pass the full country object to onChange
                                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    >
                                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {country.CountryName}
                                      </span>
                                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Combobox.Option>
                                  ))}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          State
                        </label>
                        <div className="w-full">
                          <Combobox
                            as="div"
                            value={selectedState}
                            onChange={handleStateChange}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                } // Handle the search query
                                displayValue={(state) => state?.StateName || ""} // Show the selected state name
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredStates.map((state) => (
                                  <Combobox.Option
                                    key={state.StateID}
                                    value={state}
                                    className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                  >
                                    <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                      {state.StateName}
                                    </span>
                                    <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          City
                        </label>
                        <div className="w-full">
                          <Combobox
                            as="div"
                            value={selectedCity}
                            onChange={handleCityChange}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                } // Handle the search query
                                displayValue={(city) => city?.CityName || ""} // Show the selected city name
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filteredCities
                                  .filter((city) =>
                                    city.CityName.toLowerCase().includes(
                                      query.toLowerCase()
                                    )
                                  ) // Filter based on query
                                  .map((city) => (
                                    <Combobox.Option
                                      key={city.CityID}
                                      value={city}
                                      className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white"
                                    >
                                      <span className="block truncate font-normal group-data-[selected]:font-semibold">
                                        {city.CityName}
                                      </span>
                                      <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Combobox.Option>
                                  ))}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-1/3 text-xs font-medium text-gray-700">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="ZipCode"
                          value={addressFormData.ZipCode}
                          onChange={handleAddressFormChange}
                          className={`p-1 mt-2 mb-1 w-full border rounded-md ${
                            error ? "border-red-500" : "border-gray-400"
                          }`}
                        />
                      </div>

                      <div></div>

                      <div className="mt-6 flex justify-end gap-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          onClick={() => {
                            handleAddressFormSubmit(customerId);
                          }}
                        >
                          {addressFormData.AddressID ? "Update" : "Save"}{" "}
                          {/* Conditional button text */}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
                        >
                          Cancel
                        </button>
                      </div>
                      {isLoading && <LoadingAnimation />}
                    </div>
                    <TableContainer
                      component={Paper}
                      sx={{ width: "90%", margin: "0 auto", mt: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Address 1</StyledTableCell>
                            <StyledTableCell>Address 2</StyledTableCell>
                            <StyledTableCell>City</StyledTableCell>
                            <StyledTableCell>State</StyledTableCell>
                            <StyledTableCell>Zip Code</StyledTableCell>
                            <StyledTableCell>Actions</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {addressTableData && addressTableData.length > 0 ? (
                            addressTableData.map((address, index) => (
                              <TableRow key={index}>
                                <StyledTableCell>
                                  {address.AddressLine1 || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {address.AddressLine2 || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {cityMap[address.CityID] || "N/A"}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {stateMap[address.StateID] || "N/A"}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {address.ZipCode || ""}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div className="button-container">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEdit(address.AddressID)
                                      }
                                      className="button edit-button"
                                    >
                                      <AiOutlineEdit
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                      />
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDelete(
                                          address.AddressID,
                                          customerId
                                        )
                                      }
                                      className="button delete-button"
                                    >
                                      <MdOutlineCancel
                                        aria-hidden="true"
                                        className="h-4 w-4"
                                      />
                                      Delete
                                    </button>
                                  </div>
                                </StyledTableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <StyledTableCell
                                colSpan={6}
                                style={{ textAlign: "center" }}
                              >
                                No addresses found
                              </StyledTableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}

                {activeStep === 2 && (
                  <>
                    <TableContainer
                      component={Paper}
                      sx={{ width: "90%", margin: "0 auto", mt: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Order Name</StyledTableCell>
                            <StyledTableCell>Order Date</StyledTableCell>
                            <StyledTableCell>Total Amount</StyledTableCell>
                            <StyledTableCell>Order Status</StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {Array.isArray(orders) && orders.length > 0 ? (
                            orders.map((order) => (
                              <StyledTableRow key={order.OrderID}>
                                <StyledTableCell>
                                  {order.OrderNumber}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {new Date(
                                    order.OrderDate
                                  ).toLocaleDateString()}
                                </StyledTableCell>
                                <StyledTableCell>
                                  ${order.TotalAmount}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {order.OrderStatus}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))
                          ) : (
                            <TableRow>
                              <StyledTableCell
                                colSpan={6}
                                style={{ textAlign: "center" }}
                              >
                                No orders found
                              </StyledTableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Cancel Button aligned to the left */}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="button-base cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                    {isLoading && <LoadingAnimation />}
                  </>
                )}
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                className="justify-between"
              >
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Back
                </Button>

                <Button
                onClick={
                  activeStep === steps.length - 1 ? handleFinish : handleNext
                }
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </div>
    </>
  );
}

export default AddCustomers;
