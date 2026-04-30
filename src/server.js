import express from "express";
import { config } from "dotenv";
import { connectDB , disconnectDB } from "./config/db.js";
// import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoute.js";


config();
connectDB(); // Load environment variables from .env file

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowedOrigin =
    !origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// handle unhanded promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  server.close(async () => {
    await disconnectDB();
    console.log("Database disconnected successfully");
    process.exit(1);
  });
});

//handle uncaught exceptions
process.on("uncaughtException",async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  console.log("Database disconnected successfully");
  process.exit(1);
});

//Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    console.log("Database disconnected successfully");
    process.exit(0);
  });
}); 

//GET , POST , PUT , DELETE
//http://localhost:5001/auth/signup

// AUTH - signup , login , logout
//MOVIE - Getting all movies
// USER - Profile
// Watchlist - Add to watchlist , Remove from watchlist
