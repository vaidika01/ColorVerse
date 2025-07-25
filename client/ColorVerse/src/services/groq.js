import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const fetchGroqResponse = async (prompt) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/groq`, { prompt });
    return res.data;
  } catch (error) {
    console.error("Groq API Error:", error);
    return "Failed to get response from Groq.";
  }
};

export default fetchGroqResponse;
