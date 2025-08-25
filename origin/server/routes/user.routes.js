import express from "express";
import UserController from "../controllers/user.controller.js";
import { checkJwt } from '../utils/middleware.js'

const { Router } = express
const router = Router();
// Login route
router.put("/:id", checkJwt, UserController.update);

export default router;