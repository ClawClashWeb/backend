import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "./AsyncHandler.js";
import cors from "cors";
import * as dotenv from "dotenv";
import gameRecordRouter from "./routers/gameRecordRouter.js";
import userRouter from "./routers/userRouter.js";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use(gameRecordRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.post(
  "/:userId/verify",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { userpassword } = req.body;

    const post = await prisma.user.findUnique({
      where: { userId },
      select: {
        userpassword: true,
      },
    });
    if (post.userpassword === userpassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다" });
    }
  })
);

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
