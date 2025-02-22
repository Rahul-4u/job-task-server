// models/taskModel.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 50 },
  description: { type: String, maxlength: 200 },
  category: {
    type: String,
    enum: ["To-Do", "In Progress", "Done"],
    default: "To-Do",
  },
  timestamp: { type: String, required: true },
  userId: { type: String, required: true }, // Store the user ID
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
