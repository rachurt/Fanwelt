const mongoose = require('mongoose')

const bowlingRuleSchema = new mongoose.Schema({
    T20:{
        t_wicket:{
            type:Number
        },
        t_threeWicket:{
            type:Number
        },
        t_fiveWicket:{
            type:Number
        },
        t_sevenWicket:{
            type:Number
        },
        t_tenWicket:{
            type:Number
        },
        t_hatrik:{
            type:Number
        },
        t_dotBall:{
            type:Number
        },
        t_maidenover:{
            type:Number
        },
        t_economyrate:{
            type:Number
        }
    },
    ODI:{
        wicket:{
            type:Number
        },
        threeWicket:{
            type:Number
        },
        fiveWicket:{
            type:Number
        },
        sevenWicket:{
            type:Number
        },
        tenWicket:{
            type:Number
        },
        hatrik:{
            type:Number
        },
        dotBall:{
            type:Number
        },
        maidenover:{
            type:Number
        },
        economyrate:{
            type:Number
        }
    },
    TEST:{
        e_wicket:{
            type:Number
        },
        e_threeWicket:{
            type:Number
        },
        e_fiveWicket:{
            type:Number
        },
        e_sevenWicket:{
            type:Number
        },
        e_tenWicket:{
            type:Number
        },
        e_hatrik:{
            type:Number
        },
        e_dotball:{
            type:Number
        },
        e_maidenover:{
            type:Number
        },
        e_economyrate:{
            type:Number
        }
    }
})
module.exports = mongoose.model('bowling', bowlingRuleSchema)
