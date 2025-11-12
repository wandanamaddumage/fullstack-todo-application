import express from "express";
import { getAllTasks, createTask, getTaskById, updateTask, deleteTask } from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", getAllTasks);

router.get("/:id", getTaskById);    

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
