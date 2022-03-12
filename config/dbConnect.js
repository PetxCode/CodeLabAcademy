const mongoose = require("mongoose") 
const url = "mongodb://localhost/academyDB"
const dotenv = require('dotenv')
dotenv.config()

const url2 = process.env.DATABASE

mongoose.connect(url2).then(() => {
    console.log("database is now Connected, let's get ready...!")
})

module.exports = mongoose