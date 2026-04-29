// const exprss = require("express");

import express from "express";

const router = express.Router();
//router hello
router.get("/", (req, res) => {
  res.json({ httpMethod: "GET", message: "Hello, World!" });
});
router.post("/", (req, res) => {
  res.json({ httpMethod: "POST", message: "Hello, World!" });
});
router.put("/", (req, res) => {
  res.json({ httpMethod: "PUT", message: "Hello, World!" });
});
router.delete("/", (req, res) => {
  res.json({ httpMethod: "DELETE", message: "Hello, World!" });
});


// router.get("/movies", (req, res) => {
//   res.json({ message: "List of movies" });
// });

export default router;