import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
},
 { timestamps: true}
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
