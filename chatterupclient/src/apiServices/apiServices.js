import axiosInstance from "./axios";
/**
 * Makes a GET request to the specified URL.
 *
 * @param {string} url - The URL to make the GET request to.
 * @returns {Promise<any>} - The response data from the axiosInstance.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const userData = await get('https://api.example.com/users/me');
 * console.log(userData); // { id: 1, name: 'John Doe', email: 'johndoe@example.com' }
 */
// sessionStorage.setItem(
//   "employeeToken",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzVhNjkzOThhYzkxMzUyODA4YTM4MjQiLCJuYW1lIjoiVXNlcjIiLCJ0eXBlTmFtZSI6IlVzZXIiLCJjcmVhdGVkQXQiOiIyMDI0LTEyLTEyVDA0OjQwOjI1LjYwOVoiLCJ1cGRhdGVkQXQiOiIyMDI0LTEyLTEzVDEwOjMzOjU0LjAyOFoiLCJfX3YiOjAsImlhdCI6MTczNDA4NjAzNCwiZXhwIjoxNzM0MjU4ODM0fQ.Yv4Jmx3YVBPt2uUxgyojZH-DjZfpC6j1BH-QWHcyU5Y"
// );
const get = async (url) => {
  try {
    const token = sessionStorage.getItem("employeeToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(url, { headers });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a POST request to the specified URL with the provided data.
 *
 * @param {string} url - The URL to make the POST request to.
 * @param {object} data - The data to send with the request.
 * @returns {Promise<any>} - The response data from the axiosInstance.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const newData = { name: 'Jane Doe', email: 'janedoe@example.com' };
 * const response = await post('https://api.example.com/users', newData);
 * console.log(response); // { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' }
 */
const post = async (url, data) => {
  try {
    const token = sessionStorage.getItem("employeeToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

const filePost = async (url, formdata, config = {}) => {
  try {
    const token = sessionStorage.getItem("employeeToken");
    const response = await axiosInstance.post(url, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }), // Conditionally add the Authorization header if token exists
      },
      ...config,
    });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`Unexpected response code: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a PUT request to the specified URL with the provided data.
 *
 * @param {string} url - The URL to make the PUT request to.
 * @param {object} data - The data to send with the request.
 * @returns {Promise<any>} - The response data from the axiosInstance.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const updatedData = { name: 'Jane Doe', email: 'janedoe@example.com' };
 * const response = await put('https://api.example.com/users/2', updatedData);
 * console.log(response); // { id: 2, name: 'Jane Doe', email: 'janedoe@example.com' }
 */
const put = async (url, data) => {
  try {
    const token = sessionStorage.getItem("employeeToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.put(url, data, { headers });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Makes a DELETE request to the specified URL.
 *
 * @param {string} url - The URL to make the DELETE request to.
 * @returns {Promise<any>} - The response data from the axiosInstance.
 * @throws {Error} - If the request fails, an error with a statusCode and errorMessage will be thrown.
 *
 * @example
 * const response = await remove('https://api.example.com/users/2');
 * console.log(response); // {}
 */
const remove = async (url) => {
  try {
    const token = sessionStorage.getItem("employeeToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.delete(url, { headers });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

/**
 * Handles Axios errors by extracting the status code and error message.
 *
 * @param {Error} error - The Axios error object.
 * @returns {Error} - An error object with a statusCode and errorMessage.
 */
const handleAxiosError = (error) => {
  // Log the original error for debugging
  // console.error("Error in Axios request:", error);
  // Default values
  let statusCode = 500;
  let errorMessage = "An unknown error occurred.";

  // Check if the error response is defined
  if (error.response) {
    // axiosInstance responded with a status other than 200 range
    statusCode = error.response.status;
    errorMessage = error.response.statusText || errorMessage;

    // You can also include more detailed information if available
    const customErrorMessage =
      error.response.data &&
      (error.response.data.message || error.response.data.error);
    if (customErrorMessage) {
      errorMessage = customErrorMessage;
    }
  } else if (error.request) {
    // Request was made but no response was received
    errorMessage = "No response received from the axiosInstance.";
  } else {
    // Something happened in setting up the request
    errorMessage = error.message;
  }

  return { statusCode, errorMessage };
};

export { get, post, put, remove, filePost };
