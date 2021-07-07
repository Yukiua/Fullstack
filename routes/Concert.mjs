import route from 'express';
import Concert from '../models/Concert.js';
import CookieParser    from 'cookie-parser';


const { Router } = route;
const router = Router();

router.get("/table", table);
router.get("/table-data", table_data);

