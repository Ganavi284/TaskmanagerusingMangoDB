const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [1, "Title must be at least 1 character long"],
    maxlength: [200, "Title cannot exceed 200 characters"]
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"]
  },
  status: {
    type: String,
    enum: {
      values: ["Pending", "In Progress", "Completed"],
      message: "Status must be one of: Pending, In Progress, or Completed"
    },
    default: "Pending"
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model("Task", taskSchema);
