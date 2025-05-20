import { axiosInstance } from "./index";


export let signupUser=async (user)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/auth/signup",user);
    return response.data;
  }catch(error){
    return error;
  }
}

export let loginUser=async (user)=>{
  try{
    let response=await axiosInstance.post("http://localhost:3000/api/auth/login",user);
    return response.data;
  }catch(error){
    return error;
  }
}