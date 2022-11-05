const User = require('../model/userModel')
const Profile = require('../model/profileModel')
const OProfile = require('../model/organizerProfileModel')
const Room = require('../model/room')
const Fixtures = require('../model/fixtures')


const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
//const validator = require('validator')
const config = require('../config/config')
const randomstring = require('randomstring')
const nodemailer = require('nodemailer')
const env = require("dotenv")
const cors = require('cors')
const fetch = require('node-fetch')
const sgMail = require('@sendgrid/mail')


//const crypto = require('crypto')
//const { findOne } = require('../model/adminModel')


// -----------------------------------Signup--------------------------------------------------------------------

function makekey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}




exports.signup = async (req, res) => {
    try {
        const { password, confirmpass, email } = req.body
        const secure = await bcrypt.hash(password, 10)
        const pass = await bcrypt.compare(password, secure)
        // console.log(pass);

        const secure1 = await bcrypt.hash(confirmpass, 10)
        const passwrd = await bcrypt.compare(confirmpass, secure)
        // console.log(passwrd);


        const user = await User({
            email: email,
            password: secure,
            confirmpass: secure1,
            privatekey: makekey(16),
            device_type: req.body.device_type,
            device_token: req.body.device_token,
            login_type: req.body.login_type,
            social_id: req.body.social_id,
            verified: 0,
            is_organiser: 0
        })
        const value = await User.findOne({ email: req.body.email })

        if (value) {
            res.status(200).send({ success: true, message: "Email already registered" })

        } else if (pass == true && passwrd == true) {
            const data = await user.save()

            sendVerifyMail(req.body.email, data._id)

            res.status(200).send({ success: true, data })
        } else {
            res.status(404).send({ success: true, message: "password didn't match" })
        }
    }
    catch (error) {
        res.status(400).send({ success: false, error })
    }
}

//--------------------------------------Email Verification Link----------------------------------------------------------------


const sendVerifyMail = async (email, user_id) => {
    const API_KEY = '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'
    sgMail.setApiKey(API_KEY)
    const message = {
        from: 'rachnatiwarirt655@gmail.com',
        to: email,
        subject: 'Verify your Email',
        html: 'Click on Link to verify your Email <a href = "http://localhost:3005/verify?id=' + user_id + '"> Link </a>'
        //html: 'Click on Link to verify your Email <a href = "http://45.79.121.95:3005/verify?id=' + user_id + '"> Link </a>'

    }
    sgMail.send(message)
        .then((response) => console.log('Email Verification Link Sent....'))
        .catch((error) => console.log(error.message))
}


//Verify  Email and Send Private Key

exports.verify = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id },
            { $set: { verified: 1 } })
        // console.log(updateInfo.acknowledged)

        res.render("email")

        if (updateInfo.acknowledged == true) {

            const data = await User.findOne({ _id: req.query.id })
            console.log(data);
            const privatekey = data.privatekey

            privatekeyMail(data.email, privatekey)
        }
        else {
            res.status(404).send({ success: true, message: "Error" })
        }
    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}


//Send Private Key to Email

const privatekeyMail = async (email, privatekey) => {
    const API_KEY = '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'
    sgMail.setApiKey(API_KEY)

    const message = {
        from: 'rachnatiwarirt655@gmail.com',
        to: email,
        subject: 'Your Private Key',
        html: '<b>Your Private Key is: </b>' + privatekey


    }
    sgMail.send(message)
        .then((response) => console.log('Private Key has been sent....'))
        .catch((error) => console.log(error.message))
}





//--------------------------------------------Login----------------------------------------------------------

exports.login = async (req, res) => {

    try {
        const UserData = []
        const { email, password } = req.body
        const user = await User.findOne({ email, verified: 1 })
        if (user) {
            const data = await bcrypt.compare(password, user.password)
            if (data == true) {
                const organiser_profile = await OProfile.findOne({ email: email }, { userid: 0 })
                //console.log(organiser_profile)
                const user_profile = await Profile.findOne({ email: email }, { email: 0, password: 0, userid: 0 })
                if (organiser_profile == null) {
                    //console.log("i'm here....")
                    const api_token = await jwt.sign({ _id: user._id }, "my token is", { expiresIn: '1d' })
                    res.send({ success: true, message: "login successfully", UserData: user, api_token })
                } else if (user_profile == null) {
                    const api_token = await jwt.sign({ _id: user._id }, "my token is", { expiresIn: '1d' })
                    res.send({ success: true, message: "login successfully", UserData: user, api_token })
                } else {
                    const api_token = await jwt.sign({ _id: user._id }, "my token is", { expiresIn: '1d' })

                    UserData.push({
                        _id: user._id, email: user.email, password: user.password, confirmpass: user.confirmpass, privatekey: user.privatekey, verified: user.verified,
                        is_organiser: user.is_organiser, device_type: user.device_type, device_token: user.device_token,
                        login_type: user.login_type, social_id: user.social_id,
                        _id: user_profile._id, name: user_profile.name, username: user_profile.username, mobile_number: user_profile.mobile_number, image: user_profile.image, user_level: user_profile.user_level,
                        _id: organiser_profile._id, organiser_profile: organiser_profile.organiser_profile, organiser_name: organiser_profile.organiser_name, organiser_username: organiser_profile.organiser_username, organiser_level: organiser_profile.organiser_level, is_metamask_connect: user.is_metamask_connect, api_token: api_token
                    })
                    res.status(200).send({ success: true, message: "Login Successfully", UserData })

                }

            } else {
                res.status(404).send({ success: true, message: "wrong password" })
            }
        } else {
            res.status(404).send({ success: true, message: "Please Verify your Email" })
        }

    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, error })
    }
}




//-----------------------------------------------Forget Password------------------------------------------------

exports.forgetPassword = async (req, res) => {
    try {
        const email = req.body.email
        const data = await User.findOne({ email: email })
        if (data) {
            const value = await User.updateOne({
                email: email
            })
            resetPasswordMail(data.email, email)

            res.status(200).send({ success: true, message: 'Check your mail to reset your password' })
        } else {
            res.status(401).send({ success: true, message: "This email does not exists" })
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message })
    }

}

//To Reset password send mail

const resetPasswordMail = async (email, token) => {
    const API_KEY = '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'
    sgMail.setApiKey(API_KEY)
    const message = {
        to: email,
        from: 'rachnatiwarirt655@gmail.com',
        subject: 'To Reset Password',
        html: 'Click on Link to reset your password <a href = "http://localhost:3005/email?emailId=' + emailId + '"> Link </a>'
        // html: 'Click on link to reset your password <a href = "http://45.79.121.95:3005/email?emailId= ' + emailId + '"> LINK </a>'
        // html: `http://localhost:3000/reset-password/${User.id}/${token}`
    }
    sgMail.send(message)
        .then((response) => console.log('Email sent....'))
        .catch((error) => console.log(error.message))
}


exports.email = async (req, res) => {
    try {
        res.render("index")

    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}

// //Reset Password

exports.resetPassword = async (req, res) => {
    try {
        console.log("xgggggsgs")
        const emailId = req.params.email
        // const emailId = req.body.email
        console.log(emailId)
        const data = await User.findOne({ emailId: emailId})
        console.log(data)
        if (data) {
            const password = req.body.password
            console.log(password)
            const confirmpass = req.body.confirmpass
            console.log(confirmpass)
            if (password === confirmpass) {
                const secure = await bcrypt.hash(password, 10)
                const pass = await bcrypt.compare(password, secure)
                //console.log(pass);

                const secure1 = await bcrypt.hash(confirmpass, 10)
                const passwrd = await bcrypt.compare(confirmpass, secure)
                //console.log(passwrd);

                const userdata = await User.findOneAndUpdate({ emailId },
                    { $set: { password: secure, confirmpass: secure1 } }, { new: true })

                    console.log(emailId)
                res.status(200).send({ success: true, message: "User password has been changed" })
            }
        }
        else {
            res.status(401).send({ success: true, message: "link has been expired" })
        }
    } catch (error) {
        res.status(400).send({ success: false, error })
    }
}





//---------------------------------------Reset Password Using Private Key----------------------------------------------

exports.privateKeyResetPass = async (req, res) => {
        try {
            const privateId = req.body.privatekey
            const data = await User.findOne({ privatekey: privateId })
            //console.log(data)
            if (data) {
                const password = req.body.password
                //console.log(password)
                const confirmpass = req.body.confirmpass
                // console.log(confirmpass)
                if (password === confirmpass) {
                    const secure = await bcrypt.hash(password, 10)
                    const pass = await bcrypt.compare(password, secure)
                    console.log(pass);

                    const secure1 = await bcrypt.hash(confirmpass, 10)
                    const passwrd = await bcrypt.compare(confirmpass, secure)
                    console.log(passwrd);

                    const userdata = await User.findOneAndUpdate({ privateId },
                        { $set: { password: secure, confirmpass: secure1 } }, { new: true })

                    console.log(userdata);

                    res.status(200).send({ success: true, message: "User password has been changed", data })
                }
                else {
                    res.status(401).send({ success: true, message: "Wrong Password" })
                }
            }
            else {
                res.status(401).send({ success: true, message: "Wrong privatekey" })
            }
        } catch (error) {
            res.status(400).send({ success: false, error })
        }
    }



    // ---------------------------------------User Profile------------------------------------------------------------

    exports.userprofile = async (req, res) => {
        try {
            const user = req.user
            const id = user._id
            console.log(id);

            const datt = await User.findOne({ _id: id })
            console.log(datt);
            if (datt) {
                const value = await Profile({
                    userid: id,
                    name: req.body.name,
                    username: req.body.username,
                    email: datt.email,
                    mobile_number: req.body.mobile_number,
                    password: datt.password,
                    image: req.file.filename,
                    user_level: req.body.user_level
                })
                const data = await value.save()
                res.send(data)
            }
        } catch (error) {
            res.status(400).send({ success: false, error })
        }
    }


    exports.updateProfile = async (req, res) => {
        try {
            const user = req.user
            const id = user._id
            //console.log(id)
            const data = await Profile.findOneAndUpdate({ userid: id },
                {
                    $set: {
                        name: req.body.name,
                        username: req.body.username,
                        // email: data.email,
                        mobile_number: req.body.mobile_number,
                        password: secure,
                        image: req.file.filename
                    }
                }, { new: true })

            console.log(data);

            res.send(data)

        } catch (error) {
            res.send(error)
        }
    }



    exports.updatePassword = async (req, res) => {
        try {
            // console.log('sfdfce')
            const user = req.user
            const id = user._id
            // console.log(id)

            const userpass = await User.findOne({ _id: id })
            //console.log(userpass.password)

            const oldpassword = req.body.password
            const abc = await bcrypt.compare(oldpassword, userpass.password)
            //console.log(abc)

            if (abc == true) {
                const password1 = req.body.password1
                //console.log(password1)
                const confirmpass = req.body.confirmpass
                // console.log(confirmpass)

                if (password1 == confirmpass) {
                    const secure = await bcrypt.hash(password1, 10)
                    // console.log(secure);
                    const pass = await bcrypt.compare(password1, secure)
                    // console.log(pass);

                    const secure1 = await bcrypt.hash(confirmpass, 10)
                    // console.log(secure1);
                    const passwrd = await bcrypt.compare(confirmpass, secure)
                    //console.log(passwrd);

                    const userdata = await User.findOneAndUpdate({ oldpassword },
                        { $set: { password1: secure, confirmpass: secure1 } }, { new: true })

                    //console.log(id)

                    res.status(200).send({ success: true })
                }
            } else {
                res.status(401).send({ message: " password is incorrect" })
            }

        } catch (error) {
            res.status(401).send({ success: false, error })
        }
    }



    // exports.getuserprofile = async (req, res) => {
    //     try {
    //         const user = req.user
    //         const id = user._id
    //         const data = await Profile.findOne({ userid: id })

    //             .populate('userid')
    //         console.log(data)
    //         if (data) {
    //             res.status(200).send({ success: true, data })
    //         }
    //         else {
    //             res.status(200).send({ success: true, message: "No profile found" })
    //         }

    //     } catch (error) {
    //         res.status(400).send({ success: false, error })
    //     }


    // }


    //Organizer Profile

    exports.organizerProfile = async (req, res) => {
        try {
            const user = req.user
            const id = user._id
            console.log(id);

            const value = await User.findOne({ _id: id })
            if (value) {
                const data = await OProfile({
                    userid: id,
                    organiser_profile: req.file.filename,
                    organiser_name: req.body.organiser_name,
                    organiser_username: req.body.organiser_username,
                    organiser_level: req.body.organiser_level
                })
                await data.save()
                res.send({ data })
            }


        } catch (error) {
            res.status(400).send({ success: false, error })
        }
    }

    exports.updateOrganiserProfile = async (req, res) => {
        try {
            const user = req.user
            const id = user._id
            console.log(id)
            const organiser_data = await OProfile.findOneAndUpdate({ userid: id },
                {
                    $set: {
                        organiser_profile: req.file.filename,
                        organiser_name: req.body.organiser_name,
                        organiser_username: req.body.organiser_username,
                        organiser_level: req.body.organiser_level
                    }
                })
            res.status(200).send({ success: true, organiser_data })
        } catch (error) {
            res.status(400).send({ success: true, error })
        }
    }


    //Organizer Data

    // exports.organizer = async(req, res)=>{
    //     try{
    //         const user = req.user
    //         const data = await Room.find({userId: user._id})
    //         if(data){
    //             res.status(200).send({success:true, data})
    //         }
    //         else{
    //             res.status(200).send({success:true, message:"No organizer found"})
    //         }

    //     }catch(error){
    //         res.status(400).send({success:false, error})
    //     }

    // }



    // -----------------------------------------Room Api-------------------------------
    //Create Room
    exports.createroom = async (req, res) => {
        try {
            const user = req.user
            const id = user._id
            console.log(id);
            const room = await Room.findOne({ roomName: req.body.roomName })
            if (room) {
                res.status(200).send({ success: true, message: "Room already exist" })
            }
            else {
                const random = Math.floor(Math.random() * 123456789)
                const user = await Room({
                    userId: id,
                    roomId: random,
                    roomName: req.body.roomName,
                    joinId: req.body.joinId,
                    status: 1
                })
                const data = await user.save()
                res.status(200).send({ success: true, data })
            }

        } catch (error) {
            console.log(error);
            res.status(400).send({ success: false, error })
        }
    }



    //Join Room

    exports.joinRoom = async (req, res) => {
        try {
            const user = req.user
            console.log(user._id)
            // console.log(value)   
            const sameuser = await Room.findOne({ joinId: user._id })
            if (sameuser) {
                res.status(200).send({ success: true, sameuser })
            }
            else {
                const data = await Room.findOneAndUpdate({ roomName: req.body.roomName },
                    { $push: { joinId: user._id } }, { new: true })
                //await data.save()
                res.status(200).send({ success: true, data })
            }
        } catch (error) {
            console.log(error)
            res.status(400).send({ success: false, error })
        }
    }


    //Close Room
    exports.closeroom = async (req, res) => {
        try {
            const roomId = req.body.roomId
            const data = await Room.findOneAndUpdate({ roomId },
                { $set: { status: 0 } }, { new: true })
            console.log(data);
            res.status(200).send({ success: true, data })

            // const roomId = req.body.roomId
            // const data = await Room.findOne({roomId})
            // console.log(data)

        } catch (error) {
            console.log(error);
            res.status(400).send({ success: false, error })
        }
    }



    exports.liveRoom = async (req, res) => {
        try {
            const user = req.user
            const data = await Room.find({ userId: user, status: 1 })
            console.log(data)
            // const {status} = req.body
            // if(status == 1){
            res.status(200).send({ success: true, data })

            // }
        } catch (error) {
            res.status(400).send({ success: false, error })
        }
    }



    exports.roomresult = async (req, res) => {
        try {

        } catch (error) {

        }
    }

    //-----------------------------------------Fixtures------------------------------------------------------

    exports.getMatch = async (req, res) => {
        try {
            const api = await fetch("https://rest.entitysport.com/v2/matches/?status=1&token=43a7a03a643068fe73cde001db21fe68")

            const data = await api.json()
            console.log(data);
            res.status(200).json({ success: true, data })

        } catch (error) {
            res.status(400).send({ success: false, error })
        }
    }


    exports.fixture = async (req, res) => {
        try {
            const user = req.user
            console.log(user._id)
            //const api = await fetch("https://rest.entitysport.com/v2/matches/?status=1&token=43a7a03a643068fe73cde001db21fe68")
            //console.log(api)
            const data = await Fixtures({
                userId: user._id,
                match_id: req.body.match_id,
                title: req.body.title,
                short_title: req.body.short_title,
                status: req.body.status
            })
            const value = await data.save()
            res.status(200).send({ success: true, value })

        } catch (error) {
            res.status(400).send({ success: false, error })
        }

    }

    exports.livedata = async (req, res) => {
        try {
            const user = req.user
            console.log(user._id)
            const live = await Fixtures.find({ userId: user._id, status: 1 })
            if (live) {
                res.status(200).send({ success: true, live })
            }
            else {
                res.status(200).send({ success: true, message: 'No live matches are found' })
            }
        } catch (error) {
            res.status(400).send({ success: false, error })

        }
    }









    