import express from "express";
import { getAllTasks } from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", getAllTasks);

router.post("/", createTask);

router.get("/:id", getTask);    

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
