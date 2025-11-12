import Tasks from "../models/Tasks.js";
import mongoose from "mongoose";


export async function getAllTasks(_, res) {
  try {
    const tasks = await Tasks.find().sort({ createdAt: -1 }); // optional: sort by newest
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await Tasks.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export async function createTask(req, res) {
  try {
    // ✅ 1. Destructure only the fields you expect
    const { content, completed = false } = req.body;

    // ✅ 2. Validate input
    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Task content is required and must be a string." });
    }

    // ✅ 3. Create a new Task instance
    const task = new Tasks({ content, completed });

    // ✅ 4. Save to database
    const savedTask = await task.save();

    // ✅ 5. Respond with 201 Created and the saved task
    return res.status(201).json(savedTask);

  } catch (error) {
    console.error("❌ Error creating task:", error);

    // ✅ 6. Avoid leaking sensitive error info to the client
    return res.status(500).json({ message: "Internal server error. Please try again later." });
  }
}

export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { content, completed } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    // Update only provided fields
    const updatedTask = await Tasks.findByIdAndUpdate(
      id,
      { content, completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("❌ Error in updateTask controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function deleteTask(req, res) {
  try {
    const deletedTask = await Tasks.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export const deleteTask = (req, res) => {
//     res.status(200).send("You just deleted a task");
// }