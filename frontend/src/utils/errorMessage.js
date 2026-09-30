export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    if (!error?.response) {
        return "Unable to reach the server. Check your connection and try again.";
    }

    const data = error.response.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.error) {
        return data.error;
    }

    return fallback;
};
