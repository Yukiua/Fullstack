import route from 'express';
const { Router } = route;
const router = Router();
import Concert from '../models/Concert.js';
import CookieParser    from 'cookie-parser';

router.get("/table", table);
router.get("/table-data", table_data);

async function table(req, res){
    return res.render("table");
}

async function table_data(req, res){
    const concerts = await Concert.findAll({raw: true});
    return res.json({
        "total": concerts.length,
        "rows": concerts
    })
}