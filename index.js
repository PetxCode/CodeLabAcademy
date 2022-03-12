const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const port = process.env.PORT || 2290


const app = express()

const dbConnect = require("./config/dbConnect")



app.use(cors({origin:"*"}))
app.use(express.json())

app.get("/", (req,res) => {
    res.end("This is CodeLab Academy")
})

app.use("/user", require("./routers/userRouters"))
app.use("/course", require("./routers/courseRoutes"))

app.listen(port, () => {
    console.log("server is now successfully connected...!")
})