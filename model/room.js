const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    roomId:{
        type:Number
    },
    roomName:{
        type:String
    },
    joinId:{
         type:Array
    },
    status:{
        //default:0
        type:Number
    }

})

module.exports = mongoose.model('room', roomSchema)