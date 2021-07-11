  
import route from 'express';
const { Router } = route;
const router = Router();
export default router;

router.get("/profile",  (req, res, next) => {
return res.render('user/profile.html'); 
});

