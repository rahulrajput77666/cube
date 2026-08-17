const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.19:8080/cube";

export const loginUser = async ({ username, password }) => {
  const endpoint = `${API_BASE_URL.replace(/\/$/, "")}/api/v1/auth/login`;

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
  // Use a backend logout endpoint when the backend exposes one.
  return true;
};
