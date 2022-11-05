const express = require('express')
const router = express.Router()
const controller = require('../controller/adminController')

router.post('/adminlogin', controller.adminlogin)
router.post('/adminsignup', controller.adminsignup)


router.get('/alluser', controller.alluser)
router.get('/getRoom',  controller.getRoom)
router.get('/liveRoom', controller.liveRoom)
router.get('/organizer/:id', controller.organizer)

//Ruleset
router.post('/addRule', controller.addRule)
router.post('/updateRule/:id', controller.updateRule)
router.get('/getruleset', controller.getRuleSet)

router.post('/addRuleB', controller.addRuleB)
router.post('/updateruleB/:id', controller.updateRuleB)
router.get('/getrulesetB', controller.getRuleSetB)

router.post('/addruleF', controller.addRuleF)
router.post('/updaterulef/:id', controller.updateRuleF)
router.get('/getrulesetf', controller.getRuleSetF)




router.post('/adddoublecaptain', controller.adddoublecaptain)
router.post('/updatedouble/:id', controller.updateDoubleCaptain)
router.get('/getdouble', controller.getDoubleRule)


module.exports = router