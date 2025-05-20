let router=require("express").Router();
let authMiddleware=require("./../Middlewares/authMiddleware");
let Chat=require("./../models/chat");
let Message=require("./../models/message");

router.post("/new-message",authMiddleware,async (req,res)=>{
  try{
    //1. Store the message in message collection
    let newMessage=new Message(req.body);
    let savedMessage=await newMessage.save();
    
    //2. update the lastMessage in chat collection
    let currentChat=await Chat.findOneAndUpdate({
      _id:req.body.chatId
    },{
      lastMessage:savedMessage._id,
      $inc:{unreadMessageCount:1}
    });
    res.status(201).send({
      message:"Message sent successfully",
      success:true,
      data:savedMessage
    })
  }catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})

router.get("/get-all-messages/:chatId",authMiddleware,async (req,res)=>{
  try{
    let allMessages=await Message.find({chatId:req.params.chatId}).sort({createdAt:1});
    res.send({
      message:"Message fetched successfully",
      success:true,
      data:allMessages
    })
  }catch(error){
    res.status(400).send({
      message:error.message,
      success:false
    })
  }
})
module.exports=router;