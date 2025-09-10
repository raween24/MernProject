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
// Autoriser toutes les origines (test)
app.use(cors());


// Middleware
app.use(bodyParser.json());

// Get environment variables
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGOURL;

// Check if MongoDB URI is provided
if (!MONGOURL) {
    console.error("ERROR: MONGOURL is not defined in .env file");
    console.error("Please create a .env file with MONGOURL=mongodb://localhost:27017/MernConnection");
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
