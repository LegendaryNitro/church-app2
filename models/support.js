const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const SupportSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"UserChurchApp"}
    }],
    postedBy:{
       type:ObjectId,
       ref:"UserChurchApp"
    }
},{timestamps:true})

mongoose.model("Support",SupportSchema)