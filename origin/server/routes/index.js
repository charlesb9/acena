import express from 'express';

import AuthRoutes from './auth.routes.js';
import PlaneRoutes from './plane.routes.js';
import ContactRoutes from './contact.routes.js';
import UserRoutes from './user.routes.js';

const { Router } = express

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/plane', PlaneRoutes);
router.use('/user', UserRoutes);

router.use('/contact', ContactRoutes)

export default router;
