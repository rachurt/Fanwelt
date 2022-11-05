const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema({
    tournamentName:{
        type:String
    },
    playerName:{
        type:String
    },
    points:{
        type:Number
    },
    rank:{
        type:Number
    }
})