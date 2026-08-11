const PERMISSION_REQUESTS_KEY = "permissionRequests";
const UPLOADED_SOLUTIONS_KEY = "uploadedSolutions";

export const loadPermissionRequests = () => {
  try {
    const stored = window.localStorage.getItem(PERMISSION_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const savePermissionRequests = (requests) => {
  try {
    window.localStorage.setItem(PERMISSION_REQUESTS_KEY, JSON.stringify(requests));
  } catch (error) {
    // ignore storage failures
  }
};

export const loadUploadedSolutions = () => {
  try {
    const stored = window.localStorage.getItem(UPLOADED_SOLUTIONS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

export const saveUploadedSolutions = (solutions) => {
  try {
    window.localStorage.setItem(UPLOADED_SOLUTIONS_KEY, JSON.stringify(solutions));
  } catch (error) {
    // ignore storage failures
  }
};
