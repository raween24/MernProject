// models/Log.js
import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  userName: { type: String, required: true }, 
  action_name: { 
    type: String, 
    enum: ["login", "logout","update","delete" , "register" ], 
    required: true 
  },
  timestamp: { type: Date, default: Date.now }, 
  message: { type: String },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
