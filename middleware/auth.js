const jwt = require('jsonwebtoken')
const { UserModel } = require('../models/user.model')
const {BlackListModel} = require('../models/blacklist.model')
require('dotenv').config()

const auth = async (req,res,next)=>{
    const authheader = req.headers.authorization;
        const refreshtoken = req.cookies.refreshtoken;
if(!authheader){
        return res.status(400).send({
            "msg":"token required "
        })
    }
    const token = authheader.split(' ')[1]
    if(token){
        try {
            
            const blacklisttoken = await BlackListModel.findOne({Token:token})
            if(blacklisttoken){
                return res.status(400).send({
                    "msg":" new token required "
                })
            }
            const decoded = jwt.verify(token , process.env.AccessTokenSecret)
            if(decoded){
                req.body.UserID = decoded.UserID;
                req.body.role = decoded.Role

                next()
            }
} 
        
        catch (error) {
            const [token , UserID, Role] = generateNewToken(refreshtoken)
            if(token){

                req.headers.authorization = `Bearer ${token}`

                req.body.UserID = UserID

                req.body.Role = Role

                next()

            }

            else{
                return res.status(400).send({"msg":"login required."})
}



        }
    }
    else{
        return res.status(400).send({
            "msg":"token required to access protected route."
        })
    }
}
function generateNewToken(refreshtoken){
    if(!refreshtoken){
        return []
    }
    try {
        
        const decoded = jwt.verify(refreshtoken , process.env.TokenSecret)
        if(decoded){

            const token = jwt.sign({UserID:decoded.UserID , role:decoded.Role}, process.env.AccessTokenSecret, {expiresIn:"1m"})

       return [token , decoded.UserID, decoded.Role]
    }
    } 
    catch (error) {
                return error
    }
}
module.exports = {
    auth
}