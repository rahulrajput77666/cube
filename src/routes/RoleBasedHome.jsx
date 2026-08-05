import { Navigate } from "react-router-dom";

const RoleBasedHome = () => {
  const raw =
    (typeof window !== "undefined" &&
      localStorage.getItem("userRole")) ||
    "EMPLOYEE";

  const role = raw.toUpperCase();

  if (role === "ADMIN" || role === "MANAGER") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/search" replace />;
};

export default RoleBasedHome;
