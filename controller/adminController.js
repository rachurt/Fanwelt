const Admin = require("../model/adminModel")
const User = require("../model/userModel")
const Profile = require("../model/profileModel")
const Rule = require('../model/rulesetModel')
const BowlingRule = require('../model/bowlingRule')
const FieldingRule = require('../model/fieldingRule')
const WinRule = require('../model/winprediction')
const Dcaptain = require('../model/doublecaptainModel')

const Room = require("../model/room")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//Signup

exports.adminsignup = async (req, res) => {
    const data = await Admin({
        email: req.body.email,
        password: req.body.password
    })
    const value = await data.save()
    console.log(value)
    res.send(value)
}

exports.adminlogin = async (req, res) => {
    try {
        const data = await Admin.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if (!data) {
            res.status(200).send({ success: true, msg: "Email or Password not found" })
        } else {
            //const value = data.save()
            res.status(200).send({ success: true, data })
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error })
    }
}





// -------------------------------------All User-----------------------------------------------------------------

exports.alluser = async (req, res) => {
    try {
        const user = await User.find()
        if (user) {
            res.status(200).send({ success: true, user })
        }
        else {
            res.status(200).send({ success: true, message: 'User not found' })
        }

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}



//------------------------------ROOM FIXTURE----------------------------------------

exports.getRoom = async (req, res) => {
    try {

        //console.log(user._id)
        const room = await Room.find()
        if (room) {
            res.status(200).send({ success: true, room })
        }
        else {
            res.status(200).send({ success: true, message: "Room not found" })
        }
    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}


exports.liveRoom = async (req, res) => {
    try {
        //const id = req.params.id
        const room = await Room.find({ status: 1 })
        console.log(room)
        res.status(200).send({ success: true, room })
    } catch (error) {
        req.status(400).send({ success: false, error })
    }
}




//----------------------Organizer Data-----------------------------------------

exports.organizer = async (req, res) => {
    try {
        const id = req.params.id
        //console.log(id);
        const data = await Room.find({ userId: id })
        if (data) {
            res.status(200).send(data)
        }
        else {
            res.status(200).send({ success: ture, message: "No organizer found" })
        }

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}


//-------------------------------Rule Set----------------------------------------
//Batting

exports.addRule = async (req, res) => {
    try {
        const { toneRun, tfiftyRun, tfourRun,
            tsixRun, tstrikeRate, oneRun, fiftyRun, fourRun, sixRun, strikeRate,
            eoneRun, efiftyRun, efourRun, esixRun, estrikeRate } = req.body
        console.log(oneRun)
        const data = await Rule({
            "T20.toneRun": toneRun, "T20.tfiftyRun": tfiftyRun, "T20.tfourRun": tfourRun, "T20.tsixRun": tsixRun, "T20.tstrikeRate":tstrikeRate,
            "ODI.oneRun": oneRun, "ODI.fiftyRun": fiftyRun, "ODI.fourRun": fourRun, "ODI.sixRun": sixRun, "ODI.strikeRate":strikeRate,
            "TEST.eoneRun": eoneRun, "TEST.efiftyRun": efiftyRun, "TEST.efourRun": efourRun, "TEST.esixRun": esixRun, "TEST.estrikeRate":estrikeRate
        })
       // console.log(data);
        const result = data.save()
        res.status(200).send({ success: true, result })

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}


exports.updateRule = async (req, res) => {
    try {
        const id = req.params.id
        const { toneRun, tfiftyRun, tfourRun, tsixRun, tstrikeRate,
            oneRun, fiftyRun, fourRun, sixRun,  strikeRate,
            eoneRun, efiftyRun, efourRun, esixRun, estrikeRate } = req.body
        const data = await Rule.findOneAndUpdate({ _id: id },
            {
                $set: {
                    "T20.toneRun": toneRun, "T20.tfiftyRun": tfiftyRun, "T20.tfourRun": tfourRun, "T20.tsixRun": tsixRun, "T20.tstrikeRate":tstrikeRate,
                    "ODI.oneRun": oneRun, "ODI.fiftyRun": fiftyRun, "ODI.fourRun": fourRun, "ODI.sixRun": sixRun, "ODI.strikeRate":strikeRate,
                    "TEST.eoneRun": eoneRun, "TEST.efiftyRun": efiftyRun, "TEST.efourRun": efourRun, "TEST.esixRun": esixRun, "TEST.estrikeRate":estrikeRate
                }
            },
            { new: true })

        res.status(200).send({ success: true, data })

    } catch (error) {
        res.status(200).send({ success: false, error })
    }
}




exports.getRuleSet = async (req, res) => {
    try {
        const data = await Rule.findOne()
        if (data) {
            res.status(200).send({ success: true, data })
        }
        else {
            res.status(200).send({ success: true, message: "No rules found" })
        }

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}

//Bowling

exports.addRuleB = async (req, res) => {
    try {
        const { t_wicket, t_threeWicket, t_fiveWicket, t_sevenWicket, t_tenWicket, t_hatrik, t_dotBall, t_maidenover, t_economyrate,
            wicket, threeWicket, fiveWicket, sevenWicket, tenWicket, hatrik, dotBall, maidenover,  economyrate,
            e_wicket, e_threeWicket, e_fiveWicket, e_sevenWicket, e_tenWicket, e_hatrik, e_dotball, e_maidenover, e_economyrate } = req.body

        const data = await BowlingRule({
            "T20.t_wicket": t_wicket, "T20.t_threeWicket": t_threeWicket,
            "T20.t_fiveWicket": t_fiveWicket, "T20.t_sevenWicket": t_sevenWicket, "T20.t_tenWicket": t_tenWicket,
            "T20.t_hatrik": t_hatrik, "T20.t_dotBall": t_dotBall, "T20.t_maidenover": t_maidenover, "T20.t_economyrate": t_economyrate,

            "ODI.wicket": wicket, "ODI.threeWicket": threeWicket, "ODI.fiveWicket": fiveWicket,
            "ODI.sevenWicket": sevenWicket, "ODI.tenWicket": tenWicket,
            "ODI.hatrik": hatrik, "ODI.dotBall": dotBall, "ODI.maidenover": maidenover, "ODI.economyrate": economyrate,

            "TEST.e_wicket": e_wicket, "TEST.e_threeWicket": e_threeWicket, "TEST.e_fiveWicket": e_fiveWicket,
            "TEST.e_sevenWicket": e_sevenWicket, "TEST.e_tenWicket": e_tenWicket,
            "TEST.e_hatrik": e_hatrik, "TEST.e_dotball": e_dotball, "TEST.e_maidenover": e_maidenover, "TEST.e_economyrate": e_economyrate
        })
        const result = await data.save()
        res.status(200).send({ success: true, result })

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}

exports.updateRuleB = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const {t_wicket, t_threeWicket, t_fiveWicket, t_sevenWicket, t_tenWicket, t_hatrik, t_dotBall, t_maidenover,  t_economyrate,
            wicket, threeWicket, fiveWicket, sevenWicket, tenWicket, hatrik, dotBall, maidenover, economyrate,
            e_wicket, e_threeWicket, e_fiveWicket, e_sevenWicket, e_tenWicket, e_hatrik,  e_dotball, e_maidenover, e_economyrate } = req.body

            const data = await BowlingRule.findOneAndUpdate({_id:id},
            {
                $set: {
                    "T20.t_wicket": t_wicket, "T20.t_threeWicket": t_threeWicket,
                    "T20.t_fiveWicket": t_fiveWicket, "T20.t_sevenWicket": t_sevenWicket, "T20.t_tenWicket": t_tenWicket,
                    "T20.t_hatrik": t_hatrik, "T20.t_dotBall": t_dotBall, "T20.t_maidenover": t_maidenover, "T20.t_economyrate": t_economyrate,

                    "ODI.wicket": wicket, "ODI.threeWicket": threeWicket, "ODI.fiveWicket": fiveWicket,
                    "ODI.sevenWicket": sevenWicket, "ODI.tenWicket": tenWicket,
                    "ODI.hatrik": hatrik, "ODI.dotBall": dotBall, "ODI.maidenover": maidenover, "ODI.economyrate": economyrate,

                    "TEST.e_wicket": e_wicket, "TEST.e_threeWicket": e_threeWicket, "TEST.e_fiveWicket": e_fiveWicket,
                    "TEST.e_sevenWicket": e_sevenWicket, "TEST.e_tenWicket": e_tenWicket,
                    "TEST.e_hatrik":e_hatrik, "TEST.e_dotball": e_dotball, "TEST.e_maidenover":e_maidenover, "TEST.e_economyrate": e_economyrate
                }
            }, { new: true })
        //const value = await data.save()
        res.status(200).send({ success:true, data })
    } catch (error) {
        res.status(400).send({ success:false, error })
    }
}


exports.getRuleSetB = async(req, res)=>{
    try{
        const data = await BowlingRule.findOne()
        if(data){
            res.status(200).send({success:true, data})
        }else{
            res.status(401).send({success:true, message:"no rule set found"})
        }
    }catch(error){
        res.status(400).send({success:false, error})
    }
}



//Fielding

exports.addRuleF = async(req, res)=>{
    try{
        const {t_catch, t_runout,  t_manofmatch, t_scoreprediction, t_predictiondefine,
            o_catch, runout,  manofmatch, scoreprediction, predictiondefine,
            e_catch, e_runout,  e_manofmatch, e_scoreprediction, e_predictiondefine,
            t_winningTeam,  winningTeam,   e_winningTeam} = req.body

            const data = await FieldingRule({
                "T20.t_catch":t_catch, "T20.t_runout":t_runout, "T20.t_manofmatch":t_manofmatch, "T20.t_scoreprediction":t_scoreprediction,"T20.t_predictiondefine":t_predictiondefine,
                "ODI.o_catch":o_catch, "ODI.runout":runout, "ODI.manofmatch":manofmatch, "ODI.scoreprediction":scoreprediction, "ODI.predictiondefine":predictiondefine,
                "TEST.e_catch":e_catch, "TEST.e_runout":e_runout, "TEST.e_manofmatch":e_manofmatch, "TEST.e_scoreprediction":e_scoreprediction, "TEST.e_predictiondefine":e_predictiondefine,
                "T20.t_winningTeam": t_winningTeam,  "ODI.winningTeam": winningTeam, "TEST.e_winningTeam": e_winningTeam 
            })
            const result = await data.save()
            res.status(200).send({success:true, result})
    }catch(error){
        res.status(400).send({success:false, error})
    }
   
}

exports.updateRuleF = async(req, res)=>{
    try{
        const id = req.params.id
        const {t_catch, t_runout,  t_manofmatch, t_scoreprediction,t_predictiondefine,
            o_catch, runout,  manofmatch, scoreprediction, predictiondefine,
            e_catch, e_runout,  e_manofmatch, e_scoreprediction, e_predictiondefine,
            t_winningTeam,  winningTeam,   e_winningTeam } = req.body

        const data = await FieldingRule.findOneAndUpdate({ _id:id },
            {$set:{
                "T20.t_catch":t_catch, "T20.t_runout":t_runout, "T20.t_manofmatch":t_manofmatch, "T20.t_scoreprediction":t_scoreprediction, "T20.t_predictiondefine":t_predictiondefine,
                "ODI.o_catch":o_catch, "ODI.runout":runout, "ODI.manofmatch":manofmatch, "ODI.scoreprediction":scoreprediction, "ODI.predictiondefine":predictiondefine,
                "TEST.e_catch":e_catch, "TEST.e_runout":e_runout, "TEST.e_manofmatch":e_manofmatch, "TEST.e_scoreprediction":e_scoreprediction, "TEST.e_predictiondefine":e_predictiondefine,
                "T20.t_winningTeam": t_winningTeam,  "ODI.winningTeam": winningTeam, "TEST.e_winningTeam": e_winningTeam  }},
                {new:true})
                //const value = await data.save()
                res.status(200).send({success:true, data})
    }catch(error){
        res.status(400).send({success:false, error})
    }
}

exports.getRuleSetF = async(req, res)=>{
    try{
        const data = await FieldingRule.findOne()
        if(data){
            res.status(200).send({success:true, data})
        }else{
            res.status(401).send({success:true, message:"No rule found"})
        }

    }catch(error){
        res.status(400).send({success:false, error})
    }
}


//Double Captain


exports.adddoublecaptain = async(req, res)=>{
    try{
        const { t_doublecaptain, o_doublecaptain,  e_doublecaptain} = req.body

            const data = await Dcaptain({
                "T20.t_doublecaptain":t_doublecaptain, 
                "ODI.o_doublecaptain":o_doublecaptain,
                "TEST.e_doublecaptain":e_doublecaptain 
            })
            const result = await data.save()
            res.status(200).send({success:true, result})
    }catch(error){
        res.status(400).send({success:false, error})
    }
   
}




exports.updateDoubleCaptain = async(req, res)=>{
    try{
        const id = req.params.id
        const { t_doublecaptain, o_doublecaptain, e_doublecaptain} = req.body

        const data = await Dcaptain.findOneAndUpdate({ _id:id },
            {$set:
                {"T20.t_doublecaptain":t_doublecaptain,
                "ODI.o_doublecaptain":o_doublecaptain,
                "TEST.e_doublecaptain":e_doublecaptain
            }},{new:true})
        res.status(200).send({success:true, data})

    }catch(error){
        res.status(400).send({success:true, error})
    }
}

exports.getDoubleRule = async(req, res)=>{
    try{
        const data = await Dcaptain.findOne()
        if(data){
            res.status(200).send({success:true, data})
        }else{
            res.status(401).send({success:true, message:"No rule found"})
        }

    }catch(error){
        res.status(400).send({success:false, error})
    }
}

