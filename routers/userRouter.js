import express from "express";
import asyncHandler from "../AsyncHandler.js";
import { assert } from "superstruct";
import { createUser } from "../struct.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
const userRouter = express.Router();

// user 리퀘스트 처리
userRouter.route("/")
.get(async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
})
.post(
  asyncHandler(async (req, res) => {
    assert(req.body, createUser);
    const { userId, nickname } = req.body;
    let userpassword = req.body.userpassword;
    // hashing
    const saltRound =10;
    const salt = bcrypt.genSaltSync(saltRound); 
    userpassword = await bcrypt.hash(userpassword, salt)
    const data ={
      userId : userId,
      userpassword : userpassword,
      nickname : nickname,
      salt: salt,
    }
    const user = await prisma.user.create({ data: data });
    res.status(201).send({success : true});
  })
)

userRouter.route("/:userId")
.delete(
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

export default userRouter;