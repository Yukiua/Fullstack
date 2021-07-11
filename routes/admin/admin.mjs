import route from 'express';
const { Router } = route;
const router = Router();
export default router;

router.get("/retrieveUsers", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/retrieveUsers.html')
});
router.get("/sortAccess", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortAccess.html')
});
router.get("/sortAge", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortAge.html')
});
router.get("/sortContact", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortContact.html')
});
router.get("/sortEmail", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortEmail.html')
});
router.get("/sortGender", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortGender.html')
});
router.get("/sortName", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/sortName.html')
});
router.get("/updateUserPassword", async function(req, res){
	console.log("Cart accessed");
	return res.render('admin/updateUserPassword.html')
});