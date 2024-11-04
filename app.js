import express from "express";
import mockTasks from "./data/mock.js";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Task from "./models/Task.js";

const app = express();
app.use(express.json());

const asyncHandler = 0;
 
app.get("/tasks", async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const sortOpt = {
    createdAt: sort === "oldest" ? "asc" : "desc",
  };
  const tasks = await Task.find().sort(sortOpt).limit(count);
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ mesesage: "Not Found" });
  }
});

app.post("/tasks", async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
});

app.patch("/tasks/:id", async (req,res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if(task)
  {
    Object.keys(req.body).forEach((key) =>{
    task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  }else{
    res.status(404).send({message : "Not Found"})
  }
})

app.delete("tasks", async (req, res) =>{
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);
  if(task)
  {
    res.sendStatus(204);
  }else{
    res.status(404).send({message : "Not Found"})
  }
});

app.listen(3000, () => console.log("Server Started"));
mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));
