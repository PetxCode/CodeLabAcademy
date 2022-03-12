const express = require("express")
const router = express.Router()
const path = require("path")
const multer = require("multer")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinary = require("../config/cloudConnect")

const userModel = require("../models/userModel")
const verified = require("../config/verified")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage }).single("avatar")


router.post("/create", upload, async(req, res) => {
    try{
        const {name, password, email} = req.body
        const image = await cloudinary.uploader.upload(req.file.path)
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(password, salt) 
        const getData = await userModel.create({
           name,
           email,
           password: hashed,
           isTrainner: false,
           avatar: image.secure_url,
           avatarID: image.public_id         
        })
        res.status(200).json({message: "users found", data: getData})
    }catch(err){
        res.status(400).json({message:"Error seen", data: err.message})
    }
})

router.post("/signin", async(req, res) => {
    try{
        const {email, password} = req.body
        const getUser = await userModel.findOne({email})
        if(getUser){
            const getPassword = await bcrypt.compare(password, getUser.password)
            if(getPassword){
                const {password, ...info} = getUser._doc
                const token = jwt.sign({
                    _id: getUser._id,
                    email: getUser.email,
                    isAdmin: getUser.isAdmin,
                    isTrainner: getUser.isTrainner,
                    name: getUser.name,
                }, "AImthEONEWhoCanOPENthePOWERFulCode", {expiresIn:"3d"})
                
                res.status(201).json({
                    message:"Welcome back",
                    data: {...info, token}
                })

            }else{
                res.status(400).json({message:"Error seen", data: err.message})
            }
        }else{
          res.status(400).json({message:"Error seen", data: err.message})
        }
    }catch(err){
     res.status(400).json({message:"Error seen", data: err.message})   
    }
})

router.get("/", async(req, res) => {
    try{
        const getData = await userModel.find()
        res.status(200).json({message: "users found", data: getData})
    }catch(err){
        res.status(400).json({message:"Error seen", data: err.message})
    }
})

router.get("/:id", async(req, res) => {
    try{
        const getData = await userModel.findById(req.params.id)
        res.status(200).json({message: "individual user found", data: getData})
    }catch(err){
        res.status(400).json({message:"Error seen", data: err.message})
    }
})

router.patch("/:id", upload, async(req, res) => {
    try{
        const {name, email} = req.body
       const getUser = await userModel.findOne({email})
       if(getUser){
           await cloudinary.uploader.destroy(getData.avatarID)
        const image = await cloudinary.uploader.upload(req.file.path)
        const getData = await userModel.findByIdAndUpdate(req.params.id, {
            name,
            avatar: image.secure_url
        }, {new:true})
        res.status(200).json({message: "individual user found", data: getData})
       }else{
           res.status(400).json({message:"can't carry out this operation", data: err.message}) 
       }
    }catch(err){
        res.status(400).json({message:"Error seen", data: err.message})
    }
})

router.delete("/:id", verified, async(req, res) => {
    try{
       const getUser = await userModel.findById(req.params.id)
       if(getUser){
          await cloudinary.uploader.destroy(getUser.avatarID)
        const getData = await userModel.findByIdAndRemove(req.params.id)
        res.status(200).json({message:"deleted"}) 
       } else{
        res.status(400).json({message:"can't carry out this operation", data: err.message}) 
       }
       
    }catch(err){
        res.status(400).json({message:"Error seen", data: err.message})
    }
})

module.exports = router