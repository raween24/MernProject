import express from "express";
import { register, login ,logout } from "../controller/authController.js";

const router = express.Router();
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
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); 

export default router;