export const getAuth = () => {
  return JSON.parse(
    localStorage.getItem("auth")
  );
};

export const hasModuleAccess = (
  moduleCode
) => {
  const auth = getAuth();

  return (
    auth?.modules?.includes(
      moduleCode
    ) || false
  );
};

export const hasPermission = (
  permission
) => {
  const auth = getAuth();

  return (
    auth?.permissions?.includes(
      permission
    ) || false
  );
};