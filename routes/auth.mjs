import route from 'express';
const { Router } = route
const router = Router();
export default router;

import Performer from './PerformerAuth.mjs'
router.use("/performer", Performer)