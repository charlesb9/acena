import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { checkJwt } from '../utils/middleware.js'

const { Router } = express
const router = Router();
// Login route
router.post("/login", AuthController.login);

// Me route
router.post("/reset", AuthController.resetPassword);

// Me route
router.post("/me", checkJwt, AuthController.me);

export default router;