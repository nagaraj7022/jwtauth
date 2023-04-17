const express = require('express')
const blogRouter=express.Router()
const {BlogModel} = require('../models/blog.model')
const { auth } = require('../middleware/auth')
const mongoose = require('mongoose')
const { UserModel } = require('../models/user.model')
const { verifyRole } = require('../middleware/verify')




blogRouter.post("/add", auth ,async (req,res)=>{

    const {Title , Description} = req.body;

    const AuthorID = req.body.UserID;
    try {
        const nag = new BlogModel({AuthorID,Title,Description})
await nag.save()

        return res.status(200).send({
            "msg":"Blog created",
            "Blog":nag
        })

    } 
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})



blogRouter.get("/get" , auth, async(req,res)=>{
let {UserID} = req.body;

    UserID = new mongoose.Types.ObjectId(UserID)

    try {
        
        const vlogs = await UserModel.aggregate([{$match:{_id:UserID}}, {$lookup : {from:"blogs" , localField:"_id", foreignField:"AuthorID", as:"Blogs"} } , {$project:{Email:1, name:1,role:1,"Blogs.Title":1, "Blogs.Description":1 , "Blogs._id":1}}])

        return res.status(200).send({
            "msg":"blog fetched successfully",
            "Blog":vlogs
        })

    } 
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})


blogRouter.delete("/delete/:ID" , auth , verifyRole(["User", "Moderator"]), async(req,res)=>{

    const {ID} = req.params;

    try {
        
        await BlogModel.findByIdAndDelete({_id:ID})

        return res.status(200).send({
            "msg":"Blog deleted successfully"
        })

    }
    
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }

})



blogRouter.patch("/update/:ID" , auth , verifyRole(["User"]), async(req,res)=>{

    const {ID} = req.params;
    try {
        await BlogModel.findByIdAndUpdate({_id:ID},{...req.body})
        const nag = await BlogModel.findOne({_id:ID})
        return res.status(200).send({
            "msg":"Blog Updated Successfully",
            "blog":nag
        })
    } 
    catch (error) {
        return res.status(400).send({
            "msg":error.message
        })
    }
})

module.exports = {
    blogRouter
}