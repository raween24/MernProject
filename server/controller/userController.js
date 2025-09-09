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
