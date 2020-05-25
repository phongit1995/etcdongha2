let express= require("express");
let router = express.Router();
let {checkIsLogin} = require('./../commons/checkPermisson');
let path = require('path');
let multer  = require('multer');
let {uploadFileToServer} = require('./../commons/middleware');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/storage'));
    },
    filename: function (req, file, cb) {
      cb(null, req.user.Id+'-' + Date.now()+'-'+ file.originalname);
    }
})
let upload = multer({ storage: storage })
let OperatingDiaryController = require('./../controllers/operatingdiary');
router.get('/',checkIsLogin,OperatingDiaryController.index);
router.post('/create',checkIsLogin,upload.single('FileImages'),uploadFileToServer,OperatingDiaryController.create);
router.post('/getlist',checkIsLogin,OperatingDiaryController.getlist);
router.post('/delete',checkIsLogin,OperatingDiaryController.deleteOperatingDiary);
router.post('/getInfo',checkIsLogin,OperatingDiaryController.getInfo);
router.post('/update',checkIsLogin,upload.single('FileImages'),uploadFileToServer,OperatingDiaryController.update);
router.post('/search',checkIsLogin,OperatingDiaryController.search);
module.exports = router ;