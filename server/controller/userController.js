import User from "../model/userModele.js"; // casse exacte

export const create = async (req, res) => {
    try {
        const { email } = req.body; // prends l'email directement de la requête
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User(req.body);
        const saveData = await newUser.save();

        res.status(201).json(saveData); // res.status et non req.status
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // récupère tous les utilisateurs
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
// Get user by ID (sans _id et __v)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("name email adresse -_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;          // récupère l'id de l'URL
    const updateData = req.body;         // données à mettre à jour

    // findByIdAndUpdate(id, update, options)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // renvoie le document mis à jour
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
// Supprimer un utilisateur par ID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
