let router=require("express").Router();
let User=require("./../models/user");
let authMiddleware=require("./../Middlewares/authMiddleware");
let cloudinary=require("./../cloudinary");
const message = require("../models/message");
// get details of current logged-in user
router.get("/get-logged-user",authMiddleware,async (req,res)=>{
  try{
    let user=await User.findOne({_id:req.body.userId});
    res.send({
      message:"user fetched successfully",
      success:true,
      data:user
    })
  }
  catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})

// get all users details except current user
router.get("/get-all-user",authMiddleware,async (req,res)=>{
  try{
    let userId=req.body.userId;
    let allUsers=await User.find({_id:{$ne:userId}});
    res.send({
      message:" all users fetched successfully",
      success:true,
      data:allUsers
    })
  }
  catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})

router.post("/upload-profile-pic",authMiddleware,async(req,res)=>{
  try{
    let image=req.body.image;

    // 1. upload the image to cloudinary
    let uploadedImage=await cloudinary.uploader.upload(image,{
      folder:"quick-chat"
    });

    // update the user model &  set the profile pic property
    let user=await User.findByIdAndUpdate(
      {_id:req.body.userId},
      {profilePic:uploadedImage.secure_url},
      {new:true}
    );
    res.send({
      message:"Profile picture uploaded successfully",
      success:true,
      data:user
    })
  }catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})
module.exports=router;