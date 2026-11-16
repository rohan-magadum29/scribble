import { Router } from "express";
import { getStrokes } from "../controllers/strokeController.js";

const router : ReturnType< typeof Router> = Router();

router.get("/:roomCode/strokes", getStrokes);

export default router;
