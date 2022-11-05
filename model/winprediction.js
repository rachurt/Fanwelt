const mongoose = require('mongoose')

const winSchema = new mongoose.Schema({
   T20:{
    t_winningTeam:{
        type:Number
    }
   },
   ODI:{
    winningTeam:{
        type:Number
    }
   },
   TEST:{
    e_winningTeam:{
        type:Number
    }
   }
})
module.exports = new mongoose.model('win', winSchema)