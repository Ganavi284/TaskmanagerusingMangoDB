const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Database
mongoose.connect("mongodb://127.0.0.1:27017/taskDB")
  .then(() => console.log("Database Connected"))
  .catch(err => console.log(err));

// ROUTES

// CREATE
app.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// READ - Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// READ - Get single task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// UPDATE
app.put("/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.listen(3000, () => console.log("Server running → http://localhost:3000"));
