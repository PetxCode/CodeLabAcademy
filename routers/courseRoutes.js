const express = require("express")
const multer = require("multer")
const path = require("path")
const cloudinary = require("../config/cloudConnect")
const verified = require("../config/verified")

const courseModel = require("../models/courseModel")

const router = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './videos')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage }).single("coverPix")
  const uploadVideo = multer({ storage: storage }).single("video")
  const uploadVideoImage = multer({ storage: storage }).single("videoImage")

router.get("/", async(req, res) => {
    try{
        const getCourses = await courseModel.find()
        res.status(200).json({
            message: "All Courses found",
            data: getCourses
        })
    }catch(err){
        res.status(400).json({
            message: "Error found",
            data: err.message
        })
    }
})

            // const {title, description, category,cost} = req.body
            // const image = await cloudinary.uploader.upload(req.file.path)
            // const video = await cloudinary.uploader.upload(req.file.path)

router.post("/create/:id", verified, uploadVideo, async(req, res) => {
    try{
        if(req.user.isTrainner){
            const video = await cloudinary.uploader.upload(req.file.path, { resource_type: "video" })
            let course = {
                topic: req.body.topic,
                duration: req.body.duration,
                video: video.secure_url,


            }
        const getCourses = await courseModel.findByIdAndUpdate(
            req.params.id,
            {$push: {course}},
            {new:true})
        res.status(201).json({
            message: "Courses created",
            data: getCourses
        })
        }else{
             res.status(400).json({
            message: "Error found: you don't have access for this Operation",
            data: err.message
        })
        }
    }catch(err){
        res.status(400).json({
            message: "Error found",
            data: err.message
        })
    }
})


router.post("/create", verified, upload,  async(req, res) => {
    try{
        if(req.user.isTrainner){
            const {title, description, category,cost} = req.body
            const image = await cloudinary.uploader.upload(req.file.path)
            const getCourses = await courseModel.create({
            title, 
            description, 
            category,
            cost,
            coverPix:  image.secure_url,
            coverPixID:  image.public_id,
        })
        res.status(201).json({
            message: "Course created",
            data: getCourses
        })
        }else{
             res.status(400).json({
            message: "Error found: you don't have access for this Operation",
            data: err.message
        })
        }
    }catch(err){
        res.status(400).json({
            message: "Error found",
            data: err.message
        })
    }
})


router.get("/:id",  async(req, res) => {
    try{
        const getCourses = await courseModel.findById(req.params.id)
        res.status(200).json({
            message: "Individual Courses found",
            data: getCourses
        })
    }catch(err){
        res.status(400).json({
            message: "Error found",
            data: err.message
        })
    }
})


router.get("/:id", verified,  async(req, res) => {
    try{
      if(req.user.isTrainner){
        const {title} = req.body
        const findCourse = await courseModel.findById(req.params.id)
        if(findCourse){
         const getCourses = await courseModel.findByIdAndRemove(req.params.id)
         res.status(200).json({
             message: "Individual Courses Deleted"
         })
        }
      }else{
          res.status(400).json({
            message: "Error found: can't carry out this operation",
            data: err.message
        })
      }

    }catch(err){
        res.status(400).json({
            message: "Error found",
            data: err.message
        })
    }
})



module.exports = router
