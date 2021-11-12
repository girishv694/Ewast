const mongoose = require('mongoose')
const express = require('express')
const connect = require('./config/db')
const app = express();
const user = require('./controllers/user.controller')
const cors = require('cors')


app.use(express.json());
app.use(cors())

app.use("/user",user)




app.listen(3002, async() =>{
    await connect();
    console.log("DB connected and running on port 3002");
})

