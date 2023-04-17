
const bcrypt = require('bcrypt');
const express = require("express")
const cors = require('cors')
const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())
const {connection} = require("./configure/confige")
const {UserModel} = require("./models/user.model")
const {blogRouter} = require("./routes/blog.routes")
const {userRouter} = require("./routes/user.routes")
const { auth } = require("./middleware/auth");

app.use(cors({
    origin:"*"
}))
   



require('dotenv').config()

app.use(express.json())


app.use("/user", userRouter)

app.use("/blog", blogRouter)



 


app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to mongo")
    } catch (error) {
        console.log("error")
        console.log(error)
    } 

})