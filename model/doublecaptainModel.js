const mongoose = require('mongoose')
const doublecaptainSchema = new mongoose.Schema({
    T20:{
        t_doublecaptain:{
            type:Number
        }
    },
    ODI:{
        o_doublecaptain:{
            type:Number
        }
    },
    TEST:{
        e_doublecaptain:{
            type:Number
        }  
    }
})

module.exports = mongoose.model('doublecaptain', doublecaptainSchema)