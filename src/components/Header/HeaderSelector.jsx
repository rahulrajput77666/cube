import React from "react";
import AdminHeader from "./AdminHeader";
import EmployeeHeader from "./EmployeeHeader";

const getDisplayUser = (username, role) => {
  const normalizedRole = String(role || "EMPLOYEE").toUpperCase();
  const cleanUsername = String(username || "user")
    .replace(/[._-]+/g, " ")
    .trim();

  const words = cleanUsername.split(/\s+/).filter(Boolean);
  const roleWords = ["admin", "manager", "employee", "user"];
  const filteredWords = words.filter(
    (word) => !roleWords.includes(String(word).toLowerCase())
  );

  const displayName =
    filteredWords.length > 0
      ? filteredWords
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "User";

  const userRole =
    normalizedRole === "ADMIN"
      ? "Admin"
      : normalizedRole === "MANAGER"
        ? "Manager"
        : "Employee";

  return {
    name: displayName,
    role: userRole,
  };
};

const HeaderSelector = () => {
  const raw =
    (typeof window !== "undefined" &&
      (localStorage.getItem("userRole") || localStorage.getItem("role"))) ||
    "EMPLOYEE";

  const role = String(raw).toUpperCase();
  const username =
    (typeof window !== "undefined" && localStorage.getItem("username")) ||
    "User";
  const isAdmin = role === "ADMIN" || role === "MANAGER";

  const user = getDisplayUser(username, role);

  return isAdmin ? <AdminHeader user={user} /> : <EmployeeHeader user={user} />;
};

export default HeaderSelector;
