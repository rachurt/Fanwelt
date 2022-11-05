const mongoose = require('mongoose')
const rulesetSchema = new mongoose.Schema({
    T20:{
        toneRun:{
            type:Number
        },
        tfiftyRun:{
            type:Number
        },
        tfourRun:{
            type:Number
        },
        tsixRun:{
            type:Number
        },
        tstrikeRate:{
            type:Number
        }
    },
    ODI:{
        oneRun:{
            type:Number
        },
        fiftyRun:{
            type:Number
        },
        fourRun:{
            type:Number
        },
        sixRun:{
            type:Number
        },
        strikeRate:{
            type:Number
        }
    },
    TEST:{
        eoneRun:{
            type:Number
        },
        efiftyRun:{
            type:Number
        },
        efourRun:{
            type:Number
        },
        esixRun:{
            type:Number
        },
        estrikeRate:{
            type:Number
        }

    }
   
})

module.exports = mongoose.model('ruleset', rulesetSchema)