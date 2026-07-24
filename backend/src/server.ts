import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import models
import Volunteer from "./models/Volunteer";
import Donation from "./models/Donation";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/oceansearch";

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- REST APIs --- //

// 1. Volunteer Form Submission
app.post("/api/volunteers", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const newVolunteer = new Volunteer({ name, email, role });
    await newVolunteer.save();
    res.status(201).json({ message: "Operative credentials verified and saved", data: newVolunteer });
  } catch (error) {
    res.status(500).json({ error: "Failed to save volunteer data" });
  }
});

// 2. Dummy Donation Processing
app.post("/api/donations", async (req, res) => {
  try {
    const { amount, unlockedBadge } = req.body;
    const newDonation = new Donation({ amount, unlockedBadge });
    await newDonation.save();
    
    // Broadcast the donation globally to update "Total Raised" (could add to dashboard)
    io.emit("new_donation", { amount, unlockedBadge });
    
    res.status(201).json({ message: "Donation successfully processed", data: newDonation });
  } catch (error) {
    res.status(500).json({ error: "Failed to process donation" });
  }
});

// --- SOCKET.IO REAL-TIME ENGINE --- //

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Simulated AI / IoT Data Generator
let baseTemp = 15.5;
let basePollution = 45;

setInterval(() => {
  // Drift temp slightly
  baseTemp += (Math.random() - 0.5) * 0.2;
  // Drift pollution
  basePollution += (Math.random() - 0.5) * 5;
  if (basePollution < 10) basePollution = 10;
  
  // Format current time "HH:MM"
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const dataPoint = {
    time,
    temp: parseFloat(baseTemp.toFixed(1)),
    pollution: Math.floor(basePollution)
  };

  io.emit("iot_data_update", dataPoint);
}, 5000); // push new point every 5 seconds

// Contextual Red Alerts Generator
setInterval(() => {
  if (Math.random() > 0.85) {
    const threats = [
      { type: "oil_spill", message: "Oil Spill Detected", color: "orange" },
      { type: "illegal_vessel", message: "Illegal Trawler Detected", color: "red" },
      { type: "plastic_accumulation", message: "Massive Plastic Patch", color: "yellow" },
      { type: "coral_bleaching", message: "Severe Coral Bleaching", color: "purple" },
      { type: "marine_mammal", message: "Marine Mammal Distress", color: "blue" }
    ];
    
    const threat = threats[Math.floor(Math.random() * threats.length)];
    const confidence = Math.floor(90 + Math.random() * 9);
    
    io.emit("critical_threat", {
      type: threat.type,
      message: `CRITICAL: ${threat.message} in Sector ${Math.floor(Math.random() * 9)}G.`,
      confidence: `${confidence}%`,
      color: threat.color,
      coordinates: `${(Math.random() * 180 - 90).toFixed(4)}°, ${(Math.random() * 360 - 180).toFixed(4)}°`,
      affectedSpecies: ["Dolphins", "Sea Turtles", "Reef Sharks"][Math.floor(Math.random() * 3)]
    });
  }
}, 15000); // Check every 15 seconds

// Start Server
server.listen(PORT, () => {
  console.log(`DeepSea Guardian Backend running on http://localhost:${PORT}`);
});
