import Log from "../model/logmodel";

// 🔹 Récupérer tous les logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }); // les logs les plus récents en premier
    res.status(200).json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs :", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Récupérer les logs d’un utilisateur spécifique
export const getLogsByUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const logs = await Log.find({ userName }).sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error("Erreur lors de la récupération des logs pour l’utilisateur :", err);
    res.status(500).json({ message: err.message });
  }
};