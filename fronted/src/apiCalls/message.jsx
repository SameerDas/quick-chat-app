import { axiosInstance } from "./index"

export let createNewMessage=async(message)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/message/new-message",message);
    return response.data;
  }catch(error){
    return error;
  }
}

export let getAllMessages=async(chatId)=>{
  try{
    let response=await axiosInstance.get(`http://localhost:3000/api/message/get-all-messages/${chatId}`);
    return response.data;
  }catch(error){
    return error;
  }
}