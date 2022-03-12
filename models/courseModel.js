const mongoose = require("mongoose")
const userModel = require("./userModel")

const courseList = mongoose.Schema({
    topic:{
        type: String
    },
    videoImage:{
        type: String
    },
    video:{
        type: String
    },
    duration:{
        type: String
    },
},{timestamps: true})

const courseModel = mongoose.Schema({
    createdBy: {
        type:String
    },

    title: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    
    course: [courseList],
    cost: {
        type: Number
    },
    coverPix: {
        type:String
    },
    coverPixID: {
        type:String
    }
},{timestamps: true})

module.exports = mongoose.model("courses", courseModel)