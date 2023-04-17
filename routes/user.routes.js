const express=require("express")
const userRouter=express.Router()
const {UserModel}=require("../models/user.model")
const {connection}=require("../configure/confige")
const dns=require("dns")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")



userRouter.post('/register', async (req, res)=>{

    const { name,email,pass,role} = req.body;

    try {

        const userPresent = await UserModel.find({email}).count();

        if(userPresent){
            return res.status(400).send({"msg":"user already exits"});
        }

        const hashPassword = bcrypt.hashSync(pass, 5);

        const newUser = new UserModel( { name,email, pass : hashPassword,role } );

        await newUser.save();

        return res.status(200).send({msg:"register successfull", user : newUser})

    } catch (error) {
        
        res.status(500).send({eroor:error.message})

    }
})


userRouter.post('/login', async (req, res)=>{

    const { email, pass } = req.body;

    try {

        const userPresent = await UserModel.findOne({email});

        if(!userPresent){
            return res.status(400).send({"msg":"user doesn't exits"});
        }

        const verifyPass = bcrypt.compareSync(pass, userPresent.pass);

        if(!verifyPass){
            return res.status(400).send({
                msg:"Invalid Password"
            })
        }

        const token = jwt.sign( { email, role:userPresent.role }, process.env.secureKey, {expiresIn : "1m" })

        res.cookie( "TOKEN", token, { maxAge : 1000*5*60 } )

        return res.status(200).send({
            msg:"login successfull"
        })

    } catch (error) {
        
        res.status(500).send({eroor:error.message})

    }
})


userRouter.get('/logout', async(req,res)=>{

    const { TOKEN } = req.cookies;

    blacklistedToken.push( TOKEN );

    return res.status(200).send({
        msg:"logout successfull"
    })

})

module.exports={
    userRouter
}



