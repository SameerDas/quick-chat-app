import { axiosInstance } from "./index";


export let signupUser=async (user)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-8u1l.onrender.com/api/auth/signup",user);
    return response.data;
  }catch(error){
    return error;
  }
}

export let loginUser=async (user)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-8u1l.onrender.com/api/auth/login",user);
    return response.data;
  }catch(error){
    return error;
  }
}