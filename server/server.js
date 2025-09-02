import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["https://colorverse-frontend.onrender.com", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Groq Proxy Server is running");
});

app.post("/api/groq", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Groq API failed" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`GROQ proxy running on port ${PORT}`));
