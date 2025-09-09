import mongoose from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    adresse: {
        type: String,
        required: false
    },
});
// Create and export the model
const User = mongoose.model("User", userSchema);
export default User;
