const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const chatSchema = new mongoose.Schema({
    room:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
     time:{
        type:String,
        required:true
    },
},{timestamps:true})

mongoose.model("Chat",chatSchema)


