import { axiosInstance } from "./index"

export let getLoggedUser=async()=>{
  try{
    let response=await axiosInstance.get("https://quick-chat-app-server-ow9p.onrender.com/api/user/get-logged-user");
    return response.data;
  }catch(error){
    return error;
  }
}

export let getAllUsers=async()=>{
  try{
    let response=await axiosInstance.get("https://quick-chat-app-server-8u1l.onrender.com/api/user/get-all-user");
    return response.data;
  }catch(error){
    return error;
  }
}

export let uploadProfilePic=async(image)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-8u1l.onrender.com/api/user/upload-profile-pic",{image});
    return response.data;
  }catch(error){
    return error;
  }
}