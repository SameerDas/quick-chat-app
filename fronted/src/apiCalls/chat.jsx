import { axiosInstance } from "./index";

export let getAllChats=async()=>{
  try{
    let response=await axiosInstance.get("https://quick-chat-app-server-ow9p.onrender.com/api/chat/get-all-chats");
    return response.data;
  }catch(error){
    return error;
  }
}

export let createNewChat=async(members)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-ow9p.onrender.com/api/chat/create-new-chat",{members});
    return response.data;
  }catch(error){
    return error;
  }
}

export let clearUnreadMessageCount=async(chatId)=>{
  try{
    let response=await axiosInstance.post("https://quick-chat-app-server-ow9p.onrender.com/api/chat/clear-unread-message",{chatId:chatId});
    return response.data;
  }catch(error){
    return error;
  }
}