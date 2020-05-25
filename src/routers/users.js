let express= require("express");
let {checkIsLogin,CheckIsSuperAdmin,checkIsAdmin} = require('./../commons/checkPermisson');
let router = express.Router();
let UserController = require('./../controllers/user');

router.get("/" ,checkIsLogin,checkIsAdmin,UserController.index);
router.post('/create',checkIsLogin,checkIsAdmin,UserController.createUser);
router.post('/changepassword',checkIsLogin,checkIsAdmin,UserController.changepassword);
router.post('/delete',checkIsLogin,checkIsAdmin,UserController.deleteuser);
module.exports  = router ;
