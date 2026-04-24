export const getErrorMessage = (error, fallbackMessage) =>
  (error?.code === "ERR_NETWORK" || !error?.response
    ? "Unable to connect to the server. Please make sure the backend is running on http://localhost:5000."
    : null) ||
  error?.response?.data?.message ||
  error?.response?.data?.msg ||
  fallbackMessage;
