import express from "express";
import ContactController from "../controllers/contact.controller.js";

const { Router } = express
const router = Router();

// Login route
router.post("/", ContactController.sendMail);


export default router;