export const getAuth = () => {
  try {
    const auth = localStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    return null;
  }
};

const extractValue = (source, keys) => {
  if (!source || typeof source !== "object") {
    return "";
  }

  for (const key of keys) {
    if (source[key]) return source[key];

    const nested = source?.data?.[key];
    if (nested) return nested;
  }

  return "";
};

export const saveAuthSession = (authData = {}) => {
  const payload = authData?.data && typeof authData.data === "object" ? authData.data : authData;
  const token =
    extractValue(payload, ["token", "jwt", "accessToken", "authToken"]) ||
    authData?.token ||
    "";
  const username =
    extractValue(payload, ["username", "userName", "email"]) ||
    payload?.user?.username ||
    authData?.username ||
    "";
  const roles = Array.isArray(payload?.roles)
    ? payload.roles
    : payload?.role
      ? [payload.role]
      : Array.isArray(authData?.roles)
        ? authData.roles
        : authData?.role
          ? [authData.role]
          : [];

  const normalized = {
    token,
    username,
    user: payload?.user || authData?.user || {
      username,
      roles,
    },
    roles,
    role: payload?.role || authData?.role || roles[0] || "EMPLOYEE",
    modules: payload?.modules || authData?.modules || [],
    permissions: payload?.permissions || authData?.permissions || [],
    expiresAt: payload?.expiresAt || authData?.expiresAt || null,
  };

  localStorage.setItem("auth", JSON.stringify(normalized));
  localStorage.setItem("token", normalized.token);
  localStorage.setItem("username", normalized.username);
  localStorage.setItem("role", normalized.role);
  localStorage.setItem("userRole", normalized.role);
  localStorage.setItem("roles", JSON.stringify(normalized.roles));

  return normalized;
};

export const clearAuthSession = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userRole");
  localStorage.removeItem("username");
  localStorage.removeItem("roles");
};

export const getAuthToken = () => {
  return getAuth()?.token || localStorage.getItem("token") || "";
};

export const getUserRoles = () => {
  try {
    const stored = localStorage.getItem("roles");
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    // ignore parse errors
  }

  return [];
};

export const hasModuleAccess = (moduleCode) => {
  const auth = getAuth();
  return auth?.modules?.includes(moduleCode) || false;
};

export const hasPermission = (permission) => {
  const auth = getAuth();
  return auth?.permissions?.includes(permission) || false;
};

export const isAuthenticated = () => {
  return Boolean(getAuthToken());
};