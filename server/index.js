import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors"; 
import authRoute from "./routes/authRoute.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// ✅ Configuration CORS SIMPLIFIÉE et FONCTIONNELLE
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ Gestion MANUELLE des requêtes OPTIONS (SANS "*")
app.options("/api/auth/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

// Get environment variables
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGOURL;

// Check if MongoDB URI is provided
if (!MONGOURL) {
    console.error("ERROR: MONGOURL is not defined in .env file");
    process.exit(1);
}

// MongoDB connection
mongoose.connect(MONGOURL)
    .then(() => {
        console.log("DB connected successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });

// Routes
app.use("/api", route);
app.use("/api/auth", authRoute);

// ✅ Route test
app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!", status: "OK" });
});