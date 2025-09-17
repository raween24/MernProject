import Log from "../model/logmodel.js";

export async function createLog(userName, action, message = "") {
  try {
    await Log.create({ userName, action_name: action, message });
  } catch (err) {
    console.error("Erreur lors de l’enregistrement du log :", err);
  }
}

export const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLogsByUser = async (req, res) => {
  const { userName } = req.params;
  const { search } = req.query; 

  try {
    const filter = { userName };
    if (search) {
      filter.action_name = { $regex: search, $options: "i" };
    }
    const logs = await Log.find(filter).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des logs" });
  }
};