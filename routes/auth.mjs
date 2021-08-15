import route from 'express';
const { Router } = route
const router = Router();
export default router;

import Performer from './auth/performer.mjs'
router.use("/performer", Performer)

import user from './auth/user.mjs'
router.use("/user", user)

import admin from './auth/admin.mjs'
router.use("/admin", admin)