import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";

// Set your secret key in .env: JWT_SECRET=your_secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, isCreator, isCurator } = req.body;
  const avatar = req.file?.filename || null;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar,
        isCreator: !!isCreator,
        isCurator: !!isCurator,
        roles: {
          create: [
            ...(isCreator ? [{ role: Role.CREATOR }] : []),
            ...(isCurator ? [{ role: Role.CURATOR }] : []),
          ],
        },
      },
    });

    return res.status(201).json({
      message: "Registration successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((r) => r.role),
        isCreator: user.isCreator,
        isCurator: user.isCurator,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};
