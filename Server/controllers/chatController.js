let router=require("express").Router();
let authMiddleware=require("./../Middlewares/authMiddleware");
let Chat=require("./../models/chat");
let Message=require("./../models/message");
router.post("/create-new-chat",authMiddleware,async (req,res)=>{
  try{
    let chat=new Chat(req.body);
    let savedChat=await chat.save();
    await savedChat.populate("members");
    res.status(201).send({
      message:"Chat created successfully",
      success:true,
      data:savedChat
    })
  }catch(error){
    res.status(400).send({
      message:error.message,
      success:false
    })
  }
})

router.get("/get-all-chats",authMiddleware,async (req,res)=>{
  try{
    let allChats=await Chat.find({members:{$in:req.body.userId}})
                                  .populate("members")
                                  .populate("lastMessage")
                                  .sort({updatedAt:-1});
    res.status(200).send({
      message:"User fetched successfully",
      success:true,
      data:allChats
    })
  }catch(error){
    res.status(400).send({
      message:error.message,
      success:false
    })
  }
})

router.post("/clear-unread-message",authMiddleware,async(req,res)=>{
  try{
    let chatId=req.body.chatId;

    // we want to update the unread message count in chat collection
    let chat=await Chat.findById(chatId);
    if(!chat){
      res.send({
        message:"NO Chat found with given chat ID.",
        success:false
      })
    }
    let updatedChat=await Chat.findByIdAndUpdate(
      chatId,
      {unreadMessageCount:0},
      {new:true}
    ).populate("members").populate("lastMessage");

    // we want to update the read property to true in message collection
    await Message.updateMany(
      {chatId:chatId, read:false},
      {read:true}
    )
    res.send({
      message:"Unread message cleared successfully",
      success:true,
      data:updatedChat
    })
  }catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})
module.exports=router;