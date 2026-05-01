import express from "express";
import { prisma } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      select: {
        id: true,
        title: true,
        overview: true,
        releaseYear: true,
        genres: true,
        runtime: true,
        posterUrl: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to load movies",
    });
  }
});

router.post("/", (req, res) => {
  res.json({ httpMethod: "POST", message: "Movie creation is not implemented yet" });
});

router.put("/", (req, res) => {
  res.json({ httpMethod: "PUT", message: "Movie update is not implemented yet" });
});

router.delete("/", (req, res) => {
  res.json({ httpMethod: "DELETE", message: "Movie delete is not implemented yet" });
});

export default router;
