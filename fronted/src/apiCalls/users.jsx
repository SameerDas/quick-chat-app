import { axiosInstance } from "./index"

export let getLoggedUser=async()=>{
  try{
    let response=await axiosInstance.get("http://localhost:3000/api/user/get-logged-user");
    return response.data;
  }catch(error){
    return error;
  }
}

export let getAllUsers=async()=>{
  try{
    let response=await axiosInstance.get("http://localhost:3000/api/user/get-all-user");
    return response.data;
  }catch(error){
    return error;
  }
}

export let uploadProfilePic=async(image)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/user/upload-profile-pic",{image});
    return response.data;
  }catch(error){
    return error;
  }
}