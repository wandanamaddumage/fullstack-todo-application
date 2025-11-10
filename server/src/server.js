import express from "express";
import tasksRoutes from "./routes/tasksRoutes.js";

const app = express();

app.use("/api/tasks", tasksRoutes);

app.get("/api/tasks", (req, res) => {
    res.status(200).send("Hello World!");
});

app.listen(5001, () => {
    console.log("Server started on port 5001");
});
