const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name:{
        type:String
    },
    username:{
        type:String
    },
    email:{
       type:String
   },
   mobile_number:{
        type:Number
    },
    password:{
        type:String
   },
   image:{
    type:String
   },
   user_level:{
    type:Number
   }
    
})

module.exports = mongoose.model('UserProfile', profileSchema)