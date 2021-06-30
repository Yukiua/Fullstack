import { Router } from 'express';
const router = Router();
export default router;

import Performer from './Performer.mjs'
router.use("/performer", Performer)