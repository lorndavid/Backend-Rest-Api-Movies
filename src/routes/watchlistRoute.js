import express from "express";
import { addToWatchlist } from "../controller/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { removeFromWatchlist } from "../controller/watchlistController.js";
import { updateWatchlistItem } from "../controller/watchlistController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";



const router = express.Router();
router.use(authMiddleware);
router.post("/",validateRequest(addToWatchlistSchema), addToWatchlist);
router.delete("/:id", removeFromWatchlist);
router.put("/:id", updateWatchlistItem);

export default router;
