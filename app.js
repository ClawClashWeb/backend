import express from "express";

const app = express();
app.use(express.json());

const asyncHandler = 0;

app.get("/", (req, res) => {
  res.json("hello");
});

app.listen(5000, () => console.log("Server Started"));
