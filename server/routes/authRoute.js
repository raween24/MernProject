import express from "express";
import { register, login } from "../controller/authController.js";

const router = express.Router();

// ✅ Gestion des requêtes OPTIONS pour le CORS preflight
router.options("/register", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

router.options("/login", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).end();
});

// Routes principales
router.post("/register", register);
router.post("/login", login);

export default router;