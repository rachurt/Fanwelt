const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    confirmpass:{
        type:String,
        required:true
    },
    privatekey:{
        type:String,
        required:true,
        unique:true
    },
    verified:{
        type:String
    },
    is_organiser:{
        type:String
    },
    device_type:{
        type:String
    },
    device_token:{
        type:String
    },
    login_type:{
        type:String
    },
    social_id:{
        type:String
    },
    is_metamask_connect:{
        type:String,
        default:0
    }


})

module.exports = mongoose.model('user', userSchema)