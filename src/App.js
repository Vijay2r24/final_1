import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import AddProduct from "./components/Addproduct/AddProduct";
import ProductPage from "./components/ProductsPage/ProductPage";
import "./index.css";
import User from "./components/User/User";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import AddEditProduct from "./components/AddEditProduct/AddEditProduct";
import Orders from "./components/Orders/Orders";
import AddOrders from "./components/Orders/AddOrders";
import Stores from "./components/Stores/Stores";
import Reports from "./components/Reports/Reports";
import Payments from "./components/Payments/Payments";
import Customer from "./components/Customer/Customer";
// import UserRole from "./components/User/UserRole";
import Userform from "./components/User/Userform";
import Storesform from "./components/Stores/Storeform";
import { UserProvider } from "./Context/userContext";
import { StoreProvider } from "./Context/storeContext";
import { CustomerProvider } from "./Context/customerContext";
import { RoleProvider } from "./Context/roleContext";
import RoleUser from "./components/UserRoles/UserRole";

import { PaymentProvider } from "./Context/paymentContext";
import Paymentform from "./components/Payments/Paymentform";
import AddCustomers from "./components/Customer/AddCustomers";
import UpdateOrder from "./components/Orders/UpdateOrder";
import Returns from "./components/Returns/Returns";
import Production from "./components/Production/Production";
import { LoadingProvider } from "./Context/LoadingContext";
import { OrderProvider } from "./Context/orderContext";
import RoleUserAddForm from "./components/UserRoles/AddRoleForm";
import RoleUserEditForm from "./components/UserRoles/EditRoleForm";
import SuccessPopup from "./components/SuccessPopup";
import { IdProvider } from "./Context/IdContext";
import DataProvider from "./Context/DataContext";
import Testing from "./components/Testing/Testing";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "./Context/AuthContext";
import Tasks from "./components/Tasks/Tasks";
import PlusToXButton from "./components/Testing/Temp";
import { UpdatedStatusOrderProvider } from "./Context/UpdatedOrder";
import Test from "./components/Testing/Testing";
import Temp from "./components/Testing/Temp";
import Feedback from "./components/FeedBack/feeedbackForm";

function App() {
  const location = useLocation();
  const showNavigation = location.pathname !== "/";
  const { userRole } = useAuth();

  return (
    <div className="App flex flex-col min-h-screen">
      {showNavigation && <Navigation />}
      <main className="flex-grow p-0gi bg-gray-100">
        <UserProvider>
          <UpdatedStatusOrderProvider>
            <StoreProvider>
              <CustomerProvider>
                <RoleProvider>
                  <PaymentProvider>
                    <LoadingProvider>
                      <OrderProvider>
                        <DataProvider>
                          <IdProvider>
                            <Routes>
                              <Route path="/" element={<Login />} />
                              <Route
                                path="/product"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <ProductPage />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/products"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <AddProduct />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/user"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <User />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Customer"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Customer />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Orders"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Orders />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/dashboard"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Dashboard />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/add-product"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <AddEditProduct />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/OrdersAdd/:orderId"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <AddOrders />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Stores"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Stores />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Reports"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Reports />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Payments"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Payments />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Paymentsform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Paymentform />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/RoleUser"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <RoleUser />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/RoleUserAddform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <RoleUserAddForm />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Popup"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <SuccessPopup />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/RoleUserEditform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <RoleUserEditForm />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Customerform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <AddCustomers />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Userform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Userform />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Storesform"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Storesform />
                                  </ProtectedRoute>
                                }
                              />

                              <Route
                                path="/update-order"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <UpdateOrder />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/Returns"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Returns />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/production"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Production />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/tasks"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Tasks />
                                  </ProtectedRoute>
                                }
                              />
                              {/* Testing route */}
                              <Route
                                path="/pop"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Temp />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/feedback"
                                element={
                                  <ProtectedRoute allowedRoles={[1]}>
                                    <Feedback />
                                  </ProtectedRoute>
                                }
                              />
                            </Routes>
                          </IdProvider>
                        </DataProvider>
                      </OrderProvider>
                    </LoadingProvider>
                  </PaymentProvider>
                </RoleProvider>
              </CustomerProvider>
            </StoreProvider>
          </UpdatedStatusOrderProvider>
        </UserProvider>
      </main>
    </div>
  );
}

export default App;
