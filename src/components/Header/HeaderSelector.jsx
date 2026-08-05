import React from "react";
import AdminHeader from "./AdminHeader";
import EmployeeHeader from "./EmployeeHeader";

const HeaderSelector = () => {
  const raw =
    (typeof window !== "undefined" &&
      localStorage.getItem("userRole")) ||
    "EMPLOYEE";

  const role = raw.toUpperCase();
  const isAdmin = role === "ADMIN" || role === "MANAGER";

  return isAdmin ? <AdminHeader /> : <EmployeeHeader />;
};

export default HeaderSelector;
