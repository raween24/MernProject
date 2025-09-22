import User from "../model/userModele.js"; 
import { createLog } from "../controller/logController.js"; 

export const create = async (req, res) => {
    try {
        const { email, name } = req.body;
        const userExist = await User.findOne({ email , name });

        if (userExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User(req.body);
        const saveData = await newUser.save();
        
        await createLog(name, "register", "User created successfully");

        res.status(201).json(saveData); 
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

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

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;          
    const updateData = req.body;         
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Création des logs
    try {
      if (updateData.password) {
        await createLog(updatedUser.name, "update", "User updated password");
      }
      if (updateData.email) {
        await createLog(updatedUser.name, "update", "User updated email");
      }
      if (updateData.name || updateData.adresse) {
        let msg = "User updated";
        if (updateData.name) msg += " name";
        if (updateData.adresse) msg += " address";
        await createLog(updatedUser.name, "update", msg);
      }
    } catch (logError) {
      console.error("Erreur lors de la création des logs:", logError);
    }

    res.status(200).json({
      user: updatedUser,
      message: "User updated successfully"
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log de suppression
    try {
      await createLog(deletedUser.name, "delete", "User account deleted permanently");
    } catch (logError) {
      console.error("Erreur lors de la création du log:", logError);
    }

    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        name: deletedUser.name,
        email: deletedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};