const express = require('express')
const router = express.Router()
const controller = require('../controller/usercontroller')
const auth = require('../Middleware/auth').authCustomer
const {validateSinginRequest, isRequestValidated,validateemptyrequest } = require("../validation/validation");

const path=require("path")
const crypto=require("crypto")
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: function(_req, file, cb){
      
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    } 
  });
var upload = multer({
    storage: storage,
    limits: {
        fields: 5,
        fieldNameSize: 50, 
        fieldSize: 20000,
        fileSize: 15000000,
    },
    fileFilter: function(_req, file, cb){
        checkFileType(file, cb);
    }
}).single('image');

var oupload = multer({
  storage: storage,
  limits: {
      fields: 5,
      fieldNameSize: 50, 
      fieldSize: 20000,
      fileSize: 15000000,
  },
  fileFilter: function(_req, file, cb){
      checkFileType(file, cb);
  }
}).single('organiser_profile');


function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}


router.post('/signup', controller.signup)
router.get("/verify", controller.verify)

router.get("/email", controller.email)
router.post('/login',controller.login)

router.post('/forgetpass', controller.forgetPassword)
// router.get('/resetpass', controller.resetPassword)
router.post('/resetpass/', controller.resetPassword)

router.get('/privatekey', controller.privateKeyResetPass)

//router.get('/organizer', auth, controller.organizer)
router.post('/userprofile', auth, upload, controller.userprofile)
router.post('/updateprofile', auth, upload,  controller.updateProfile)
router.post('/updatepass', auth,controller.updatePassword)

router.post('/organiserprofile', auth, oupload, controller.organizerProfile)
router.post('/updateoprofile', auth, oupload, controller.updateOrganiserProfile)

router.post('/closeroom', controller.closeroom)
router.post('/createroom',auth,controller.createroom)
router.post('/joinroom', auth,controller.joinRoom)

router.get('/liveroom', auth, controller.liveRoom)
//router.get('/getuserprofile', auth, controller.getuserprofile)


router.get('/getMatch', controller.getMatch)
router.post('/fixture', auth,controller.fixture)
router.get('/livedata', auth, controller.livedata)



module.exports = router