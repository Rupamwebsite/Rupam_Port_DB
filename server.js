const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "Public")));

// Explicitly serve index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Health Check Route (for Railway / hosting platforms)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running", timestamp: new Date() });
});

// MongoDB Connection
let dbConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI not found in environment variables. Set it in .env or hosting platform.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    dbConnected = true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("Database connection failed. Contact form will not work until MongoDB is available.");
  }
};

connectDB();

// --- Schemas ---
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String }, // Phone is optional but good to have in schema
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  techStack: [String],
  link: String
});

// --- Models ---
const Contact = mongoose.model("Contact", ContactSchema);
const Project = mongoose.model("Project", ProjectSchema);

// --- Routes ---

// 1. Contact Form Submission
app.post("/contact", async (req, res) => {
  if (!dbConnected) {
    return res.status(503).json({ error: "Database connection not available. Please try again later." });
  }
  try {
    const { name, email, phone, message } = req.body;
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    res.status(201).send("✅ Message sent successfully!");
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).send("Server Error");
  }
});

// 2. Get All Projects (For dynamic frontend)
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`📧 Contact API: POST http://localhost:${PORT}/contact`);
  console.log(`📦 Projects API: GET http://localhost:${PORT}/api/projects`);
});