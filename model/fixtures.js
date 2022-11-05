const mongoose = require('mongoose')

const fixtureSchema = new mongoose.Schema({
    userId:{
        type:String

    },
    match_id: {
        type: Number
    },
    title: {
        type: String
    },
    short_title: {
        type: String
    },
    status: {
        type:Number
    }
})

module.exports = mongoose.model('fixture', fixtureSchema)