const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || window.location.origin || "").replace(/\/$/, "");
const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || "/api/v1/auth/login";
const LOGOUT_ENDPOINT = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || "/api/auth/logout";
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === "true";

const getLocalRole = (username) => {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (normalizedUsername.includes("admin")) {
    return "ADMIN";
  }

  if (
    normalizedUsername.includes("manager") ||
    normalizedUsername.startsWith("mgr")
  ) {
    return "MANAGER";
  }

  return "EMPLOYEE";
};

export const loginUser = async ({ username, password }) => {
  if (!USE_BACKEND) {
    const role = getLocalRole(username);

    return {
      username,
      role,
      roles: [role],
      token: `local-${Date.now()}`,
    };
  }

  const endpoint = `${API_BASE_URL}${LOGIN_ENDPOINT}`;

  let response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch (error) {
    throw new Error(
      `Backend connection failed. Please confirm the server is running at ${endpoint} and that the VPN/network is available.`
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Login request failed with status ${response.status}.`
    );
  }

  return data;
};

export const logoutUser = async () => {
  if (!USE_BACKEND) {
    return true;
  }

  const endpoint = `${API_BASE_URL}${LOGOUT_ENDPOINT}`;
  const token = localStorage.getItem("token");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Logout request failed with status ${response.status}.`);
  }

  return true;
};
