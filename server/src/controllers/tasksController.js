export const getAllTasks = (req, res) => {
    res.status(200).send("You just fetched all tasks");
}

export const createTask = (req, res) => {
    res.status(201).send("You just created a task");
}

export const getTask = (req, res) => {
    res.status(200).send("You just fetched a task");
}

export const updateTask = (req, res) => {
    res.status(200).send("You just updated a task");
}

export const deleteTask = (req, res) => {
    res.status(200).send("You just deleted a task");
}
