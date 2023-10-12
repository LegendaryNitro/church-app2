const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const DailyVerseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    postedBy:{
       type:ObjectId,
       ref:"UserChurchApp"
    }
},{timestamps:true})

const Verse = mongoose.model("Verse",DailyVerseSchema)

module.export = Verse