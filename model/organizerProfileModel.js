const mongoose = require('mongoose')

const organiserProfileSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    organiser_profile:{
        type:String
    },
    organiser_name:{
        type:String
    },
    organiser_username:{
        type:String
    },
    organiser_level:{
        type:Number
    }

})

module.exports = mongoose.model('OrganiserProfile', organiserProfileSchema)