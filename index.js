const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
require('dotenv').config()
const cors = require('cors')

app.use(cors())


require("dotenv").config()

const bodyparser = require('body-parser')

//Connection db
const mongoose=require('mongoose')
require('./db')

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use('/image', express.static('public/uploads'))

//View Engine
app.set('view engine', 'hbs');

//template engine route
app.get("", (req,res)=>{
    res.render('index')
})

app.use(express.static('public'))

const adminRouter = require('./route/adminRoute')
app.use(adminRouter)

const userRouter = require('./route/routes')
app.use(userRouter)




app.listen(3005, function(){
    console.log('Server is Running on port 3005..!')
})