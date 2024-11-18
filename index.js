import express from "express";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "./AsyncHandler.js";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/user", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.get("/:userId/gameRecord", async (req, res) => {
  const { userId } = req.params;
  const gameCount = await prisma.gameRecord.count();
  const { nickname } = await prisma.user.findUnique({
    where: { userId },
    select: {
      nickname: true,
    },
  });
  const win = await prisma.gameRecord.count({
    where: { win: "win" },
  });
  const draw = await prisma.gameRecord.count({
    where: { win: "draw" },
  });
  const lose = await prisma.gameRecord.count({
    where: { win: "lose" },
  });
  const records = await prisma.gameRecord.findMany({
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
  const userinfo = {
    gameCount: gameCount,
    nickname: nickname,
    winCount: win,
    drawCount: draw,
    loseCount: lose,
  };
  const data = {
    records,
    userinfo,
  };
  res.send(data);
});

app.post(
  "/user",
  asyncHandler(async (req, res) => {
    const user = await prisma.user.create({ data: req.body });
    res.status(201).send(user);
  })
);

app.post(
  "/:userId/gameRecord",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { versus, win, myTeam, redScore, blueScore } = req.body;
    const user = await prisma.user.findUnique({
      where: { userId },
    });
    const data = {
      userId,
      versus,
      myTeam,
      win,
      redScore,
      blueScore,
    };
    console.log(data);
    if (user) {
      const record = await prisma.gameRecord.create({
        data: data,
      });
      res.status(201).send({ success: true });
    } else {
      return res
        .status(400)
        .send("해당 userId를 가진 사용자가 존재하지 않습니다.");
    }
  })
);

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
    console.log(typeof post.userpassword);
    console.log(userpassword);
    if (post.userpassword === userpassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ message: "비밀번호가 틀렸습니다" });
    }
  })
);
app.delete(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await prisma.user.delete({ where: { userId } });
    if (user) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "Not Found" });
    }
  })
);

app.listen(process.env.PORT || 5000, () => console.log("Server Started"));
