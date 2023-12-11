import axios from "axios";

export default async function callAPI_GET(path) {
  try {
    const response = await axios.get(`http://localhost:9000/${path}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting cuisines:",
      error.response?.data?.message || error.message
    );

    return { message: "Failed to get cuisines" };
  }
}
