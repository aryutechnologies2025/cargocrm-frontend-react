import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const storedDetails = localStorage.getItem("cargouser");
  
  if (!storedDetails) {
    return <Navigate to="/" replace />;
  }

  const parsedDetails = JSON.parse(storedDetails);
  const userRole = parsedDetails.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/page-not-found" replace />;
  }

  return children;
};

export default ProtectedRoute;