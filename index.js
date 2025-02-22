// Backend (Express.js + MongoDB)
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://inspiring-malabi-a5c212.netlify.app/",
    ],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://job-task-todo:LVIHhtonuAafMYJd@cluster0.zs3l2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    // await client.connect();
    const db = client.db("taskManager");
    const tasksCollection = db.collection("tasks");

    // ✅ Add a task
    app.post("/add-tasks", async (req, res) => {
      const task = req.body;
      task.timestamp = new Date();
      const result = await tasksCollection.insertOne(task);
      res.json(result);
    });

    // ✅ Get all tasks
    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    });

    // ✅ Update a task
    app.put("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
      res.json(result);
    });

    // ✅ Delete a task
    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    // ✅ **Task Category Update Route** (Dropdown + Drag & Drop)
    app.put("/tasks/update-category/:id", async (req, res) => {
      const { id } = req.params;
      const { category } = req.body;

      try {
        const result = await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { category } }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "Task not found or not updated" });
        }

        res.json({ message: "Task category updated successfully" });
      } catch (error) {
        console.error("Error updating task category:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
  } finally {
    // No additional closing logic needed
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
