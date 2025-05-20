import { axiosInstance } from "./index"

export let createNewMessage=async(message)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-ow9p.onrender.com/api/message/new-message",message);
    return response.data;
  }catch(error){
    return error;
  }
}

export let getAllMessages=async(chatId)=>{
  try{
    let response=await axiosInstance.get(`https://quick-chat-app-server-ow9p.onrender.com/api/message/get-all-messages/${chatId}`);
    return response.data;
  }catch(error){
    return error;
  }
}