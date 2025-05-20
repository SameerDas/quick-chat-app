let router=require("express").Router();
let bcrypt=require("bcryptjs");
let jwt=require("jsonwebtoken");
let User=require("./../models/user");
router.post("/signup",async(req,res)=>{
  try{
    // 1. if the user already exists
    let user=await User.findOne({email:req.body.email});

    //2. if user exist, send an error message
    if(user){
      return res.send({
        message:"User already exists.",
        success:true
      })
    }

    //3. encrypt the password
    let hashedPassword=await bcrypt.hash(req.body.password,10);
    req.body.password=hashedPassword;

    //4. Create new user, save in DB
    let newUser=new User(req.body);
    await newUser.save();
    res.send({
      message:"User created successfully",
      success:true
    })
  }catch(error){
    res.send({
      message:error.message,
      success:false
    });
  }
})

router.post("/login",async(req,res)=>{
  // res.send("user logged successfully");
  try{
    //1. Check if user exists;
    let user=await User.findOne({email:req.body.email});  // if email exist then return email else return undefined
    if(!user){
      return res.send({
        message:"User does not exist",
        success:false
      })
    }

    //2. check if the password is correct
    let isValid=await bcrypt.compare(req.body.password,user.password);  // if match then return true else false
    if(!isValid){
      return res.send({
        message:"inValid Password",
        success:false
      })
    }

    //3. if the user exists & password is correct, assign a JWT(ie to create token)
    let token=jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
    res.send({
      message:"user logged-in successfully",
      success:true,
      token:token
    })
  }catch(error){
    res.send({
      message:error.message,
      success:false
    })
  }
})
module.exports=router;