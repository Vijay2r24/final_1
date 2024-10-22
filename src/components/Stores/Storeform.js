import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../Context/storeContext";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import { CheckIcon } from "@heroicons/react/24/solid";

import {
  CREATEORUPDATE_STORES_API,
  GETALLUSERS_API,
  CREATEORUPDATE_MAPSTOREUSER,
  GET_MAPSTORE_USERBYSTOREID,
  DELETEMAPSTOREUSER,
} from "../../Constants/apiRoutes";
import "../../style.css";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import "react-toastify/dist/ReactToastify.css";
import { TableContainer } from "@mui/material";

import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { IoIosSearch, IoIosCall, IoMdMail } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { DataContext } from "../../Context/DataContext";

const steps = ["Store Details", "Store Users"];

function StoreForm() {
  const location = useLocation();

  const handleUserSelect = (user) => {
    setSelectedUsers([user]);
    setIsFocused(false);
    setSearchQuery(`${user.FirstName} ${user.LastName}`);
  };
  const saveSelectedUser = async () => {
    if (selectedUsers.length > 0) {
      setIsLoading(true); // Show loading animation
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const store =
          location.state?.storeDetails?.store || storeDetails?.store;
        const storeID = store?.StoreID || "";

        const payload = {
          MapStoreUserID: 0,
          StoreID: storeID,
          UserID: selectedUsers[0].UserID,
          CreatedBy: "Danny",
          FirstName: selectedUsers[0].FirstName,
          LastName: selectedUsers[0].LastName,
          Email: selectedUsers[0].Email,
          PhoneNumber: selectedUsers[0].PhoneNumber,
        };

        const response = await axios.post(
          CREATEORUPDATE_MAPSTOREUSER,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          setTableUsers((prevUsers) => [...prevUsers, selectedUsers[0]]);
          setSelectedUsers([]);
          toast.success("User  added successfully!");
        } else {
          console.error("Failed to add user:", response.data);
          toast.error(response.data.message); // Display the error message
        }
      } catch (error) {
        console.error("Error adding user:", error);
        if (error.response) {
          toast.error(error.response.data.message); // Display the error message
        } else {
          toast.error("Error adding user");
        }
      } finally {
        setIsLoading(false); // Hide loading animation
      }
    } else {
      console.error("No user selected");
    }
  };

  const navigate = useNavigate();
  const { storeDetails } = useContext(StoreContext);
  const [storeUsers, setStoreUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [countryMap, setCountryMap] = useState({});
  const [stateMap, setStateMap] = useState({});
  const [cityMap, setCityMap] = useState({});

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

  const [formData, setFormData] = useState(
    location.state?.storeDetails || {
      TenantID: 1,
      StoreID: null,
      StoreName: "",
      Email: "",
      Phone: "",
      AddressLine1: "",
      AddressLine2: "",
      CityID: "",
      StateID: "",
      CountryID: "",
      ZipCode: "",
    }
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(
    location.state?.storeDetails?.store || storeDetails?.store
  );

  const storeId = storeDetails?.store?.StoreID;

  useEffect(() => {
    const setInitialData = async () => {
      if (isEditMode) {
        const store =
          location.state?.storeDetails?.store || storeDetails?.store;

        if (!store) {
          console.warn("No store data found");
          return;
        }

        // Find country, state, and city names by matching the IDs from the store
        const selectedCountry = countries.find(
          (country) => country.CountryName === store.CountryName
        );
        const selectedState = states.find(
          (state) => state.StateName === store.StateName
        );
        const selectedCity = cities.find(
          (city) => city.CityName === store.CityName
        );
        // Set form data based on store details
        setFormData({
          TenantID: store.TenantID || 1,
          StoreID: store.StoreID || "",
          StoreName: store.StoreName || "",
          StoreCode: store.StoreCode || "",
          Email: store.Email || "",
          Phone: store.Phone || "",
          AddressLine1: store.AddressLine1 || "",
          AddressLine2: store.AddressLine2 || "",
          CountryID: selectedCountry?.CountryID || "",
          CountryName: selectedCountry?.CountryName || "",
          StateID: selectedState?.StateID || "",
          StateName: selectedState?.StateName || "",
          CityID: selectedCity?.CityID || "",
          CityName: selectedCity?.CityName || "",
          ZipCode: store.ZipCode || "",
        });
        setSelectedCountry(selectedCountry);
        setSelectedState(selectedState);
        setSelectedCity(selectedCity);
      }
    };

    setInitialData();
  }, [
    isEditMode,
    location.state?.storeDetails?.store,
    storeDetails?.store,
    countries,
    states,
    cities,
  ]);

  const fetchUsersByStoreId = async (storeId) => {
    try {
      setIsLoading(true); // Show loading animation
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${GET_MAPSTORE_USERBYSTOREID}/${storeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extracting user data from response and storing it in tableUsers
      const users = response.data.rows.map((row) => ({
        MapStoreUserID: row.MapStoreUserID,
        FirstName: row.User.FirstName,
        LastName: row.User.LastName,
        Email: row.User.Email,
        PhoneNumber: row.User.PhoneNumber,
      }));

      setTableUsers(users); // Set updated user data
    } catch (error) {
      console.error("Error fetching users by StoreID:", error);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show loading animation
    const isUpdate = formData.StoreID ? true : false;
    const apiUrl = CREATEORUPDATE_STORES_API;

    try {
      const response = await axios.post(apiUrl, formData);

      toast.success(
        isUpdate ? "Store updated successfully!" : "Store created successfully!"
      );
      setTimeout(() => {
        navigate("/Stores");
      }, 5500);
    } catch (error) {
      console.error("Store submission failed:", error);

      if (error.response) {
        toast.error(
          `Failed to ${isUpdate ? "update" : "create"} store: ` +
            error.response.data.message
        );
      } else if (error.request) {
        toast.error("No response received from server.");
      } else {
        console.error("Error in setting up request:", error.message);
        toast.error("Error: " + error.message);
      }
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleFinish = () => {
    setTimeout(() => {
      navigate("/Stores");
    }, 500);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setFormData({
  //     TenantID: 1,
  //     StoreID: null,
  //     StoreName: "",
  //     Email: "",
  //     Phone: "",
  //     AddressLine1: "",
  //     AddressLine2: "",
  //     CityID: "",
  //     StateID: "",
  //     CountryID: "",
  //     ZipCode: "",
  //   });
  //   setSelectedCountry("");
  //   setSelectedState("");
  //   setSelectedCity("");
  //   setFilteredStates([]);
  //   setFilteredCities([]);
  //   setTableUsers([]);
  // };

  const isStepSkipped = (step) => false;
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [users, setUsers] = useState([]); // All users from the API
  const [filteredUsers, setFilteredUsers] = useState([]); // Users after filtering
  const [query, setQuery] = useState("");
  const [tableUsers, setTableUsers] = useState([]); // Users added to the table
  const [selectedUsers, setSelectedUsers] = useState([]); // Users selected in the popup
  const [isModalOpen, setIsModalOpen] = useState(false); // Control the modal state
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchUsers = async (search = "") => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
          `${GETALLUSERS_API}?SearchText=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const userArray = data.users || []; // Correctly access the 'users' array

        // Check if 'userArray' is an array before mapping
        if (Array.isArray(userArray)) {
          const usersData = userArray.map((item) => ({
            ...item, // Spread the user object to include all user details
          }));
          setUsers(usersData);
        } else {
          console.error(
            "API response does not contain user data in an array:",
            userArray
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // // Only fetch when the search query has 3 or more characters

    fetchUsers(searchQuery);
  }, [searchQuery]);

  const mapStoreUser = async (selectedUser) => {
    try {
      setIsLoading(true); // Show loading animation
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get the StoreID based on whether it's edit mode or not
      const store = location.state?.storeDetails?.store || storeDetails?.store;
      const storeID = store?.StoreID || ""; // Fallback to 9 if no storeID is found

      // Construct the payload
      const payload = {
        MapStoreUserID: 0,
        StoreID: storeID, // Dynamically set the StoreID from edit mode
        UserID: selectedUser.UserID,
        CreatedBy: "Danny",
        FirstName: selectedUser.FirstName,
        LastName: selectedUser.LastName,
        Email: selectedUser.Email,
        PhoneNumber: selectedUser.PhoneNumber,
      };

      const response = await axios.post(CREATEORUPDATE_MAPSTOREUSER, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Check if the response is successful
      if (response.status === 201) {
        // Optionally, display success notification or update UI here
      } else {
        console.error("Failed to map user:", response.data);
      }
    } catch (error) {
      console.error("Error mapping user:", error);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setSearchQuery(query);

    // Start loading when search begins
    setLoading(true);

    // Simulate a delay (optional) to visualize the loading animation
    setTimeout(() => {
      const filtered = users.filter((user) => {
        const firstName = user.FirstName?.trim().toLowerCase() || "";
        const lastName = user.LastName?.trim().toLowerCase() || "";
        const email = user.Email?.trim().toLowerCase() || "";

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          email.includes(query)
        );
      });

      setFilteredUsers(filtered);

      // Stop loading after filtering
      setLoading(false);
    }, 500); // Optional delay for visualizing the loading state
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleCustomerSelect = (customer) => {
    // Check if the user is already in the table
    const isUserInTable = tableUsers.some(
      (user) => user.CustomerID === customer.CustomerID
    );

    // If the user is not in the table, add them
    if (!isUserInTable) {
      setTableUsers((prevUsers) => [...prevUsers, customer]);
    }

    // Clear the search query without updating it to the selected customer's name
    setSearchQuery("");
    setFilteredUsers([]); // Clear the dropdown after selection
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // Handle the addition of filtered users to the table
  const handleAddUsers = () => {
    setTableUsers((prevUsers) => [...prevUsers, ...selectedUsers]); // Add selected users to the table
    setSelectedUsers([]); // Clear selected users
    setIsModalOpen(false); // Close the modal after adding users
  };

  // Handle user selection in the popup (you can make this more complex to allow selecting multiple users)
  const handleSelectUser = (user) => {
    setSelectedUsers([user]); // Select the user to be added
  };

  const handleCountryChange = (selectedCountry) => {
    if (!selectedCountry) return;

    const countryID =
      countryMap[selectedCountry.CountryName] || selectedCountry.CountryID;

    setSelectedCountry(selectedCountry);
    setFormData({
      ...formData,
      CountryID: countryID,
      CountryName: selectedCountry.CountryName,
    });

    setSelectedState("");
    setSelectedCity("");
    setFilteredStates(
      states.filter((state) => state.CountryID === state.CountryID)
    );
  };

  const handleStateChange = (state) => {
    if (!state) return;

    const stateID = stateMap[state.StateName] || state.StateID;

    setSelectedState(state);
    setSelectedCity("");

    setFormData({
      ...formData,
      StateID: stateID,
      StateName: state.StateName,
    });
    setFilteredCities(cities.filter((city) => city.StateID === state.StateID));
  };

  const handleCityChange = (city) => {
    if (!city) return;

    const cityID = cityMap[city.CityName] || city.CityID;

    setSelectedCity(city);
    setFormData({
      ...formData,
      CityID: cityID,
      CityName: city.CityName,
    });
  };

  const handleCancel = () => {
    setIsLoading(true);

    setTimeout(() => {
      navigate("/Stores");
    }, 1500); // Delay by 500ms
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };
  const isStepOptional = (step) => step === 1;

  const handleRemoveUser = async (MapStoreUserID) => {
    try {
      setIsLoading(true); // Show loading animation
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Make DELETE request to remove the user
      await axios.delete(`${DELETEMAPSTOREUSER}/${MapStoreUserID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update tableUsers by filtering out the deleted user
      const updatedUsers = tableUsers.filter(
        (user) => user.MapStoreUserID !== MapStoreUserID
      );
      setTableUsers(updatedUsers);
    } catch (error) {
      console.error("Error removing user:", error);
    } finally {
      setIsLoading(false); // Hide loading animation
    }
  };

  // Handle click event on user selection
  const handleUserClick = (user) => {
    mapStoreUser(user).then(() => {
      setTableUsers((prevUsers) => [...prevUsers, user]);
    });
  };
  useEffect(() => {
    if (storeId && isEditMode !== "") {
      fetchUsersByStoreId(storeId);
    }
  }, [storeId]);
  return (
    // <div className="p-6 mr-10 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-80 w-1/8 rounded-lg">
    <div className="main-container">
      {/* <div className="p-6 mb-7 sm:px-6 lg:px-8 pt-4 bg-white shadow-lg rounded-lg"> */}
      {/* <div className="p-6 mb-7 sm:px-6 lg:px-8 pt-4 rounded-lg"> */}
      <div className="body-container">
        <ToastContainer />
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
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

          <React.Fragment>
            {activeStep === 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Store Details Form */}
                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-xs font-medium text-gray-700">
                      Store Name
                    </label>
                    <input
                      type="text"
                      name="StoreName"
                      value={formData.StoreName}
                      onChange={handleFormChange}
                      className={`p-1 mt-2 mb-1 w-full border rounded-md ${
                        error ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-xs font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="AddressLine1"
                      value={formData.AddressLine1}
                      onChange={handleFormChange}
                      className={`p-1 w-full border rounded-md ${
                        error ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-xs font-medium text-gray-700">
                      Store Code
                    </label>
                    <input
                      type="text"
                      name="StoreCode"
                      value={formData.StoreCode}
                      onChange={handleFormChange}
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
                      value={formData.AddressLine2}
                      onChange={handleFormChange}
                      className={`p-1 mt-2 mb-1 w-full border rounded-md ${
                        error ? "border-red-500" : "border-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-1/3 text-xs font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      name="Email"
                      value={formData.Email}
                      onChange={handleFormChange}
                      className={`p-1 w-full border rounded-md ${
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
                        value={selectedCountry} // Bind the selected country object here
                        onChange={(newCountry) => {
                          handleCountryChange(newCountry); // Handle country change (updates the state)
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            CountryID: newCountry.CountryID,
                            CountryName: newCountry.CountryName,
                          }));
                        }}
                      >
                        <div className="relative">
                          <Combobox.Input
                            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                            onChange={(event) => setQuery(event.target.value)} // Set the query for filtering
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
                            {countries // Access countries data correctly
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
                      Contact
                    </label>
                    <input
                      type="text"
                      name="Phone"
                      value={formData.Phone || ""}
                      onChange={handleFormChange}
                      className={`p-1 w-full border rounded-md ${
                        error ? "border-red-500" : "border-gray-400"
                      }`}
                    />
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
                            onChange={(event) => setQuery(event.target.value)} // Handle the search query
                            displayValue={(state) => state?.StateName || ""} // Show the selected state name
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredStates
                              .filter((state) =>
                                state.StateName.toLowerCase().includes(
                                  query.toLowerCase()
                                )
                              ) // Filter based on query
                              .map((state) => (
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
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="ZipCode"
                      value={formData.ZipCode || ""}
                      onChange={handleFormChange}
                      className={`p-1 w-full border rounded-md ${
                        error ? "border-red-500" : "border-gray-400"
                      }`}
                    />
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
                            onChange={(event) => setQuery(event.target.value)} // Handle the search query
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
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="submit"
                    className="button-base save-btn"
                    onClick={handleFormSubmit}
                  >
                    {isEditMode ? "Update" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="button-base cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
                {/* {isLoading && <LoadingAnimation />} */}
                {isLoading && (
                  // <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
                  <LoadingAnimation />
                  // </div>
                )}
              </>
            )}

            {activeStep === 1 && (
              <div>
                <div>
                  <div className="relative flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg pb-2 mx-auto">
                    <div className="relative w-80 max-w-md mx-auto">
                      {/* Search Input */}
                      <div className="flex items-center justify-center relative">
                        <input
                          id="searchName"
                          type="text"
                          placeholder="Search by Name..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => setIsFocused(true)}
                          className={`mt-1 p-2 pr-10 border border-gray-300 rounded-md text-sm md:text-base w-full ${
                            isFocused ? "border-blue-500" : "border-gray-300"
                          }`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <IoIosSearch aria-label="Search Icon" />
                        </div>
                      </div>

                      {/* Dropdown for filtered users */}
                      {searchQuery.length >= 3 && isFocused && (
                        <div
                          className="absolute top-full mt-1 w-full bg-white shadow-lg border border-gray-300 rounded-lg z-10"
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        >
                          {loading ? (
                            <div className="flex justify-center p-4">
                              <LoadingAnimation />
                              {/* Display loading animation when loading */}
                            </div>
                          ) : filteredUsers.length > 0 ? (
                            <div>
                              <div className="mb-2 text-sm text-gray-600 px-2">
                                {filteredUsers.length} Result
                                {filteredUsers.length > 1 ? "s" : ""}
                              </div>

                              {filteredUsers.map((user) => (
                                <div
                                  key={user.UserID}
                                  className="relative cursor-pointer flex flex-col p-2 hover:bg-gray-100 group"
                                  onClick={() => handleUserSelect(user)}
                                >
                                  <span className="font-medium">
                                    {user.FirstName} {user.LastName}
                                  </span>
                                  <div className="flex items-center text-xs md:text-sm text-gray-500">
                                    <IoIosCall
                                      className="w-4 h-4 mr-1"
                                      aria-label="Phone Icon"
                                    />
                                    <span>{user.PhoneNumber}</span>
                                  </div>
                                  <div className="flex items-center text-xs md:text-sm text-gray-500">
                                    <IoMdMail
                                      className="w-4 h-4 mr-1"
                                      aria-label="Email Icon"
                                    />
                                    <span>{user.Email}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex justify-center p-4 text-gray-500">
                              {loading ? (
                                <LoadingAnimation />
                              ) : (
                                "No results found."
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Selected User */}
                  </div>

                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-custom-darkblue py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-custom-lightblue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={saveSelectedUser}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 py-2 px-4 text-sm font-medium text-white hover:text-black shadow-sm hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </div>
                  <TableContainer
                    component={Paper}
                    sx={{ width: "90%", margin: "0 auto", mt: 4 }}
                  >
                    <Table aria-label="store users table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Username</StyledTableCell>
                          <StyledTableCell>Email</StyledTableCell>
                          <StyledTableCell>Phone</StyledTableCell>
                          <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      {/* {console.log(
                          storeId,
                          "sidadaslbdiasujdvgauiofgvsdfioudvf"
                        )} */}
                      <TableBody>
                        {tableUsers && tableUsers.length > 0 ? (
                          tableUsers.map((user) => (
                            <TableRow key={user.MapStoreUserID}>
                              {" "}
                              {/* Use user.MapStoreUserID as key */}
                              <StyledTableCell>
                                {user.FirstName} {user.LastName}
                              </StyledTableCell>
                              <StyledTableCell>{user.Email}</StyledTableCell>
                              <StyledTableCell>
                                {user.PhoneNumber}
                              </StyledTableCell>
                              <StyledTableCell>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveUser(user.MapStoreUserID)
                                  }
                                  className="button delete-button"
                                >
                                  <MdOutlineCancel
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                  Delete
                                </button>
                              </StyledTableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <StyledTableCell
                              colSpan={4}
                              style={{ textAlign: "center" }}
                            >
                              No users found
                            </StyledTableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* <div className="mt-6 flex justify-end gap-4">
                   
                    <button
                      type="button"
                      onClick={
                        activeStep === steps.length - 1
                          ? handleFormSubmit
                          : handleCancel
                      }
                      className={`button-base    ${
                        activeStep === steps.length - 1
                          ? "save-btn"
                          : "cancel-btn"
                      }`}
                    >
                      {activeStep === steps.length - 1 ? "Save" : "Cancel"}
                    </button>
                  </div> */}

                  {isLoading && <LoadingAnimation />}
                </div>
              </div>
            )}

            <Box className="flex justify-between mt-4">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className="bg-gray-300 px-4 py-2 rounded"
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
        </Box>
      </div>
    </div>
  );
}

export default StoreForm;
