const mongoose = require("mongoose") 
const url = "mongodb://localhost/academyDB"
const dotenv = require('dotenv')
dotenv.config()
const url22 = "mongodb+srv://AuthClass:AuthClass@codelab.u4drr.mongodb.net/CodeLabAcademy?retryWrites=true&w=majority"
const url2 = process.env.DATABASE

mongoose.connect(url22).then(() => {
    console.log("database is now Connected, let's get ready...!")
})

module.exports = mongoose
