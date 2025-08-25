import express from "express";
import PlaneController from "../controllers/plane.controller.js";
import { checkJwt } from '../utils/middleware.js'

const { Router } = express
const router = Router();
// Login route
router.get("/hdv/:id", checkJwt, PlaneController.getHdv);

// Login route
router.post("/hdv/:id", checkJwt, PlaneController.postHdv);

// Login route
router.put("/hdv/:planeId/:hoursId", checkJwt, PlaneController.updateHdv);

// Login route
router.delete("/hdv/:hoursId", checkJwt, PlaneController.deleteHdv);

// Login route
router.get("/previsions/:id", checkJwt, PlaneController.getPrevisions);

// Login route
router.get("/forecaste/:planeId", checkJwt, PlaneController.hasExpiredForecaste);

router.put("/previsions/schedule/:id", checkJwt, PlaneController.updateSchedule)

export default router;