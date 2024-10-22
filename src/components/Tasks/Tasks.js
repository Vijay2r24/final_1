import React, { useContext, useEffect, useState } from "react";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { IoIosSearch } from "react-icons/io";
import { Combobox } from "@headlessui/react";
import { DataContext } from "../../Context/DataContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { GET_TASKS } from "../../Constants/apiRoutes";

const Tasks = () => {
  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  useEffect(() => {
    if (storesData) {
      setStores(storesData || []);
    }
  }, [storesData]);

  const [taskData, setTaskData] = useState({
    toDo: [],
    inProgress: [],
    inReview: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userID, setUserID] = useState("1"); // Default user ID (Admin)
  const [searchName, setSearchName] = useState("");

  const userOptions = [
    { id: "3", name: "Admin" },
    { id: "1", name: "User 1" },
    { id: "5", name: "User 2" },
  ];

  const fetchTasks = async (userId, searchTerm, selectedStore) => {
    setLoading(true);
    try {
      let url = `${GET_TASKS}?UserID=${userId}&searchText=${searchTerm}`;

      // Only add StoreID to the URL if it's not null
      if (selectedStore && selectedStore.StoreID) {
        url += `&StoreID=${selectedStore.StoreID}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.message === "No tasks found for the provided UserId.") {
        setTaskData({ toDo: [], inProgress: [], inReview: [] });
      } else {
        const transformedData = {
          toDo: data.filter(
            (task) =>
              !task.OrderHistoryStatus ||
              task.OrderHistoryStatus.includes("Quick Quote") ||
              task.OrderHistoryStatus.includes("Initial Design") ||
              task.OrderHistoryStatus.includes("Initial Measurements")
          ),
          inProgress: data.filter(
            (task) =>
              task.OrderHistoryStatus &&
              (task.OrderHistoryStatus.includes("Revised Design (R1)") ||
                task.OrderHistoryStatus.includes("Revised Design (R2)") ||
                task.OrderHistoryStatus.includes("Revised Design (R#)") ||
                task.OrderHistoryStatus.includes("Final Measurement") ||
                task.OrderHistoryStatus.includes("Signup Document") ||
                task.OrderHistoryStatus.includes("Production") ||
                task.OrderHistoryStatus.includes("PDI") ||
                task.OrderHistoryStatus.includes("Dispatch"))
          ),
          inReview: data.filter(
            (task) =>
              task.OrderHistoryStatus &&
              (task.OrderHistoryStatus.includes("Installation") ||
                task.OrderHistoryStatus.includes("Completion") ||
                task.OrderHistoryStatus.includes("Canceled"))
          ),
        };

        setTaskData(transformedData);
      }
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks");
      setLoading(false);
    }
  };
  const searchItems = (value) => {
    setSearchName(value);
    fetchTasks(userID, value);
  };
  useEffect(() => {
    fetchTasks(userID, searchName, selectedStore);
  }, [userID, searchName, selectedStore]);

  if (error) return <p className="main-container">{error}</p>; // Apply error class

  return (
    <div className="main-container">
      {loading && <LoadingAnimation />}
      <h2 className="heading">User Tasks</h2>
      <hr className="border-t border-gray-300 mb-6" />

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
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">
              To Do ({taskData.toDo.length})
            </h2>
            {taskData.toDo.length > 0 ? (
              taskData.toDo.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    Order {task["OrdersTable.OrderNumber"]}
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-green-400 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "To Do"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <p className="text-orange-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks to do</p>
            )}
            <div className="absolute top-0 -right-3 h-full border-r border-gray-300"></div>{" "}
            {/* Vertical line */}
          </div>

          {/* In Progress Column */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">
              In Progress ({taskData.inProgress.length})
            </h2>
            {taskData.inProgress.length > 0 ? (
              taskData.inProgress.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    Order {task["OrdersTable.OrderNumber"]}
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-violet-800 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "In Progress"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <span className="text-green-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks in progress</p>
            )}
            <div className="absolute top-0 -right-3 h-full border-r border-gray-300"></div>{" "}
            {/* Vertical line */}
          </div>

          {/* In Review Column */}
          <div className="relative">
            <h2 className="text-xl font-medium mb-4">
              In Review ({taskData.inReview.length})
            </h2>
            {taskData.inReview.length > 0 ? (
              taskData.inReview.map((task, index) => (
                <div
                  className="bg-white p-4 rounded-lg shadow mb-4"
                  key={index}
                >
                  <h3 className="text-lg font-semibold">
                    Order {task["OrdersTable.OrderNumber"]}
                  </h3>

                  {/* Flex container for Start Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Start Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.StartDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for End Date */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">End Date</span>
                    <span className="text-gray-900 w-2/3">
                      <span className="pr-8">:</span>
                      {new Date(task.EndDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Flex container for Status */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Status</span>
                    <span className="text-red-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.OrderHistoryStatus || "In Review"}
                    </span>
                  </div>

                  {/* Flex container for Comments */}
                  <div className="flex mb-2">
                    <span className="text-gray-500 w-1/3">Comments</span>
                    <span className="text-blue-500 w-2/3">
                      <span className="pr-8">:</span>
                      {task.Comments}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tasks in review</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
