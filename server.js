const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// EJS
app.set("view engine", "ejs");

// Temporary in-memory task data
let tasks = [
    {
        id: 1,
        title: "Learn Docker",
        completed: false
    },
    {
        id: 2,
        title: "Create multi-stage Dockerfile",
        completed: false
    }
];

// Home page
app.get("/", (req, res) => {
    res.render("index", { tasks });
});

// Add task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (title && title.trim() !== "") {
        tasks.push({
            id: Date.now(),
            title: title.trim(),
            completed: false
        });
    }

    res.redirect("/");
});

// Complete/uncomplete task
app.post("/tasks/:id/toggle", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    res.redirect("/");
});

// Delete task
app.post("/tasks/:id/delete", (req, res) => {
    const id = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    res.redirect("/");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Task Manager running on http://localhost:${PORT}`);
});
