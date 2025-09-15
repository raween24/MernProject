import User from "../model/userModele.js";
import jwt from "jsonwebtoken";
import { createLog } from "../controller/logController.js"; 

export const register = async (req, res) => {
  try {
    const { name, email, adresse, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, adresse, password });
    await newUser.save();

   
    // action_name = "register"
    await createLog(newUser.name, "register", "User registered successfully");

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // action_name = "login"
    await createLog(user.name, "login", "User logged in");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
