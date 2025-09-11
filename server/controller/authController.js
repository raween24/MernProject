import User from "../model/userModele.js";
// ⚠️ SUPPRIMEZ bcrypt - On veut des mots de passe en clair
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // 1️⃣ Récupérer les champs du body
    const { name, email, adresse, password } = req.body;

    // 2️⃣ Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 3️⃣ ⚠️ SUPPRIMEZ LE HASHAGE - Utilisez le mot de passe en CLAIR
    // const hashedPassword = await bcrypt.hash(password, 10); // ❌ SUPPRIMEZ

    // 4️⃣ Créer le nouvel utilisateur avec mot de passe CLAIR
    const newUser = new User({ name, email, adresse, password }); // ✅ password direct
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
    
    console.log("📧 Email reçu:", email);
    console.log("🔑 Password reçu:", password);

    const user = await User.findOne({ email });
    console.log("👤 Utilisateur trouvé:", user);

    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // ⚠️ COMPARAISON EN CLAIR (sans bcrypt)
    if (password !== user.password) {
      console.log("❌ Mot de passe incorrect");
      console.log("🔍 Comparaison:", password, "VS", user.password);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Connexion réussie");
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
    
  } catch (err) {
    console.error("💥 Erreur:", err);
    res.status(500).json({ message: err.message });
  }
};