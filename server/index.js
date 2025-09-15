import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors"; 
import authRoute from "./routes/authRoute.js";
import logroute from "./routes/logroute.js"
dotenv.config();


const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


app.options("/api/auth/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGOURL;

if (!MONGOURL) {
    console.error("ERROR: MONGOURL is not defined in .env file");
    process.exit(1);
}
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

app.use("/api", route);
app.use("/api/auth", authRoute);
app.use("/api/logs", logroute);


app.get("/", (req, res) => {
  res.json({ message: "Backend server is running!", status: "OK" });
});