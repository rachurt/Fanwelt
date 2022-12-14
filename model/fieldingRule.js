const mongoose = require('mongoose')

const fieldingSchema = new mongoose.Schema({
    T20:{
        t_catch:{
            type:Number
        },
        t_runout:{
            type:Number
        },
        t_manofmatch:{
            type:Number
        },
        t_scoreprediction:{
            type:Number
        },
        t_predictiondefine:{
            type:Number
        },
        t_winningTeam:{
            type:Number
        }
    },
    ODI:{
        o_catch:{
            type:Number
        },
        runout:{
            type:Number
        },
        manofmatch:{
            type:Number
        },
        scoreprediction:{
            type:Number
        },
        predictiondefine:{
            type:Number
        },
        winningTeam:{
            type:Number
        }
    },
    TEST:{
        e_catch:{
            type:Number
        },
        e_runout:{
            type:Number
        },
        e_manofmatch:{
            type:Number
        },
        e_scoreprediction:{
            type:Number
        },
        e_predictiondefine:{
            type:Number
        },
        e_winningTeam:{
            type:Number
        }
    }
})

module.exports = new mongoose.model('field', fieldingSchema)