const mongoose = require('mongoose')
mongoose.set('debug', true)

mongoose.connect("mongodb://127.0.0.1:27017/fanwelt",{
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connection Successful")
}).catch(()=>{
    console.log("No Connection")
})