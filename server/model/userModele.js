import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
     name: {
    type: String,
    required: true   // 👈 obligatoire
  },
  email: {
    type: String     // 👈 optionnel maintenant
  },
  adresse: {
    type: String     // 👈 optionnel maintenant
  },
  password: {
    type: String,
    required: true   // 👈 obligatoire
  }

});
// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
