import User from "../model/userModele.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // 1️⃣ Récupérer les champs du body (attention à 'adresse', pas 'addresse')
    const { name, email, adresse, password } = req.body;

    // 2️⃣ Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 3️⃣ Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Créer le nouvel utilisateur
    const newUser = new User({ name, email, adresse, password: hashedPassword });
    await newUser.save();

    // 5️⃣ Générer un token JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6️⃣ Envoyer la réponse au frontend avec token et userId
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

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Créer JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
