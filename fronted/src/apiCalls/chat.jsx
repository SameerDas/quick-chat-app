import { axiosInstance } from "./index";

export let getAllChats=async()=>{
  try{
    let response=await axiosInstance.get("http://localhost:3000/api/chat/get-all-chats");
    return response.data;
  }catch(error){
    return error;
  }
}

export let createNewChat=async(members)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/chat/create-new-chat",{members});
    return response.data;
  }catch(error){
    return error;
  }
}

export let clearUnreadMessageCount=async(chatId)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/chat/clear-unread-message",{chatId:chatId});
    return response.data;
  }catch(error){
    return error;
  }
}