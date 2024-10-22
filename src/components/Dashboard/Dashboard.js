import React, { useContext, useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  GET_OVERALL_DATA_FOR_DASHBOARD,
  GETALLSTORES_API,
} from "../../Constants/apiRoutes";
import Datepicker from "react-tailwindcss-datepicker";
import { GET_SALES_AND_PAYMENT_REPORT_BY_MONTH } from "../../Constants/apiRoutes";
import axios from "axios";
import {
  faChartLine,
  faUsers,
  faIndianRupeeSign,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";

import "chart.js/auto";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { DataContext } from "../../Context/DataContext";

Chart.register(...registerables);

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const bigChartRef = useRef(null);
  // State to hold the API data
  const [salesAndPaymentData, setSalesAndPaymentData] = useState([]);
  const [overallData, setOverallData] = useState({});
  const [loading, setLoading] = useState(true);

  // const [storeNames, setStoreNames] = useState([]);
  const { storesData } = useContext(DataContext);
  const [storeNames, setStoreNames] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  useEffect(() => {
    if (storesData) {
      setStoreNames(storesData || []);
    }
  }, [storesData]);

  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const fetchOverallData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(GET_OVERALL_DATA_FOR_DASHBOARD, {
        StartDate: value.startDate,
        EndDate: value.endDate,
        StoreId: selectedStore.StoreID,
      });
      if (response.data.StatusCode === "SUCCESS") {
        setOverallData(response.data);
      }
    } catch (error) {
      console.error("Error fetching overall dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStore) {
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore || (value.startDate && value.endDate)) {
      fetchOverallData();
    }
  }, [selectedStore, value.startDate, value.endDate]);

  const fetchSalesAndPaymentData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        GET_SALES_AND_PAYMENT_REPORT_BY_MONTH,
        { StoreId: selectedStore.StoreID } // Pass selected store ID
      );
      if (response.data.StatusCode === "SUCCESS") {
        setSalesAndPaymentData(response.data.OrdersAndPayments);
      }
    } catch (error) {
      console.error("Error fetching sales and payment data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOverallData();
    fetchSalesAndPaymentData();
  }, []);
  useEffect(() => {
    if (selectedStore) {
      // Check if a store is selected
      fetchOverallData();
      fetchSalesAndPaymentData();
    }
  }, [selectedStore]); // Dependency on selectedStore

  // Example data for the charts (you can replace this with actual API data)

  const lineData = {
    labels: salesAndPaymentData.map((item) => item.Month),
    datasets: [
      {
        label: "Orders Per Month",
        data: salesAndPaymentData.map((item) => parseInt(item.OrderCount)),
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Total Payments Per Month",
        data: salesAndPaymentData.map((item) => parseFloat(item.TotalPayments)),
        fill: false,
        backgroundColor: "rgba(255,99,132,1)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  const doughnutData = {
    labels: overallData.OrderStatusCounts
      ? overallData.OrderStatusCounts.map((item) => item.OrderStatus)
      : [],
    datasets: [
      {
        label: "Order Status",
        data: overallData.OrderStatusCounts
          ? overallData.OrderStatusCounts.map((item) => parseInt(item.Count))
          : [],
        backgroundColor: [
          "rgba( 255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const bigChartData = {
    labels: salesAndPaymentData.map((item) => item.Month),
    datasets: [
      {
        label: "Revenue Generated",
        data: salesAndPaymentData.map((item) => parseFloat(item.TotalPayments)),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cleanup chart instances on component unmount

  useEffect(() => {
    const lineChartInstance = lineChartRef.current;
    const doughnutChartInstance = doughnutChartRef.current;
    const bigChartInstance = bigChartRef.current;
    return () => {
      if (lineChartInstance) {
        lineChartInstance.destroy();
      }

      if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
      }

      if (bigChartInstance) {
        bigChartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="main-container">
      {loading && <LoadingAnimation />}
      {/* Dashboard Header */}
      <div className="flex justify-end items-center space-x-4">
        <div className="flex flex-col items-end">
          <div className="combobox-container flex-1">
            <Combobox value={selectedStore} onChange={setSelectedStore}>
              <div className="combobox-wrapper">
                <Combobox.Input
                  className="combobox-input w-full h-10 px-3"
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

                  {storeNames.map((store) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 text-white shadow rounded-lg p-4 relative">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold">Orders</h3>
              <p className="text-2xl">{overallData.TotalOrderCount || 0}</p>
            </div>
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-4xl absolute bottom-4 right-4"
            />
          </div>
        </div>

        <div className="bg-green-500 text-white shadow rounded-lg p-4 relative">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold">Customer</h3>
              <p className="text-2xl">{overallData.CustomerCount || 0}</p>
            </div>
            <FontAwesomeIcon
              icon={faUsers}
              className="text-4xl absolute bottom-4 right-4"
            />
          </div>
        </div>

        <div className="bg-red-500 text-white shadow rounded-lg p-4 relative">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold">Revenue Generated</h3>
              <p className="text-2xl">{overallData.PaymentTotal || 0}</p>
            </div>
            <FontAwesomeIcon
              icon={faIndianRupeeSign}
              className="text-4xl absolute bottom-4 right-4"
            />
          </div>
        </div>

        <div className="bg-yellow-500 text-white shadow rounded-lg p-4 relative">
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold">Production</h3>
              <p className="text-2xl">
                {overallData.ProductionOrderCount || 0}
              </p>
            </div>
            <FontAwesomeIcon
              icon={faTasks}
              className="text-4xl absolute bottom-4 right-4"
            />
          </div>
        </div>
      </div>

      {/* Graph Section */}

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Sales</h2>

            <Line data={lineData} ref={lineChartRef} />
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Order Status</h2>

            <div className="w-72 h-72 mx-auto">
              <Doughnut data={doughnutData} ref={doughnutChartRef} />
            </div>
          </div>
        </div>

        {/* Full-width Big Chart */}

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Revenue Generated</h2>

          <Bar data={bigChartData} ref={bigChartRef} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
