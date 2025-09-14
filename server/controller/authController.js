import User from "../model/userModele.js";

import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {

    const { name, email, adresse, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, adresse, password }); 
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


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
    
    console.log(" Email reçu:", email);
    console.log(" Password reçu:", password);

    const user = await User.findOne({ email });
    console.log(" Utilisateur trouvé:", user);

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

 
    if (password !== user.password) {
      console.log(" Mot de passe incorrect");
      console.log(" Comparaison:", password, "VS", user.password);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log(" Connexion réussie");
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
    
  } catch (err) {
    console.error(" Erreur:", err);
    res.status(500).json({ message: err.message });
  }
};