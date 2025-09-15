import express from "express";
import { getAllLogs, getLogsByUser  } from "../controller/logController.js";

const router = express.Router();

// 🔹 Récupérer tous les logs
router.get("/", getAllLogs);

// 🔹 Récupérer les logs d’un utilisateur spécifique
router.get("/:userName", getLogsByUser);
export default router;
