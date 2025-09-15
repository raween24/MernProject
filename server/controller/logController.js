import Log from "../model/logmodel.js";

// Crée un log (fonction à utiliser dans userController)
export async function createLog(userName, action, message = "") {
  try {
    await Log.create({ userName, action_name: action, message });
  } catch (err) {
    console.error("Erreur lors de l’enregistrement du log :", err);
  }
}

// Récupérer tous les logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer les logs d’un utilisateur spécifique
export const getLogsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const logs = await Log.find({ userName }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};