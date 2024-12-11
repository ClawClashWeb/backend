import express from "express";
import asyncHandler from "../AsyncHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const gameRecordRouter = express.Router()

//gameRecord 리퀘스트 처리
gameRecordRouter.route("/:userId/gameRecord")
.get(async (req, res) => {
  const { userId } = req.params;
  const gameCount = await prisma.gameRecord.count({
    where: {
      userId: userId,
    },
  });
  const { nickname } = await prisma.user.findUnique({
    where: { userId },
    select: {
      nickname: true,
    },
  });
  const win = await prisma.gameRecord.count({
    where: {
      userId: userId,
      win: "win",
    },
  });
  const draw = await prisma.gameRecord.count({
    where: {
      userId: userId,
      win: "draw",
    },
  });
  const lose = await prisma.gameRecord.count({
    where: {
      userId: userId,
      win: "lose",
    },
  });
  
  //user gameRecord 처리
  const records = await prisma.gameRecord.findMany({
    orderBy: { createdAt: "desc" },
    where: { userId },
  });
  //userinfo 처리
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
})
.post(
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

export default gameRecordRouter;