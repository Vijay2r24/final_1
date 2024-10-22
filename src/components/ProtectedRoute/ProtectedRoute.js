import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import LoadingAnimation from "../Loading/LoadingAnimation";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingAnimation />; // Or a loading spinner
  }

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
