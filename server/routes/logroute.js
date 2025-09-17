import express from "express";
import { getAllLogs, getLogsByUser  } from "../controller/logController.js";

const router = express.Router();

router.get("/", getAllLogs);

router.get("/:userName", getLogsByUser);
export default router;
