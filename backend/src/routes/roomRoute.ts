import { Router } from "express";
import { getRoom } from "../controllers/roomController.js";

const router : ReturnType< typeof Router> = Router();

router.get("/:roomCode", getRoom);

export default router;
