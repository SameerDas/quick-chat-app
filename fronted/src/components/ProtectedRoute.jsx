import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import {getAllUsers, getLoggedUser } from "../apiCalls/users";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import toast from "react-hot-toast";
import { setAllChats, setAllUsers, setUser } from "../redux/usersSlice";
import { getAllChats } from "../apiCalls/chat";
let ProtectedRoute=({children})=>{
  let dispatch=useDispatch();
  let {user}=useSelector(state=>state.userReducer);
  let navigate=useNavigate();
  let getLoggedInUser=async()=>{
    let response=null;
    try{
      dispatch(showLoader());
      response=await getLoggedUser();
      dispatch(hideLoader());
      if(response.success){
        dispatch(setUser(response.data));
      }else{
        toast.error(response.message);
        navigate("/login");
      }
    }catch(error){
      dispatch(hideLoader());
      navigate("/login");
    }
  }

  let getInAllUsers=async()=>{
    let response=null;
    try{
      dispatch(showLoader());
      response=await getAllUsers();
      dispatch(hideLoader());
      if(response.success){
        dispatch(setAllUsers(response.data));
      }else{
        toast.error(response.message);
        navigate("/login");
      }
    }catch(error){
      dispatch(hideLoader());
      navigate("/login");
    }
  }

  let getCurrentUserChats=async()=>{
    try{
      let response=await getAllChats();
      if(response.success){
        dispatch(setAllChats(response.data));
      }
    }catch(error){
      navigate("/login");
    }
  }
  useEffect(()=>{
    if(localStorage.getItem('token')){
      // write logic to get the details of current user.
      getLoggedInUser();
      getInAllUsers();
      getCurrentUserChats();
    }else{
      navigate('/login');
    }
  },[]);
  return(
    <div>
      
      {children}
    </div>
  )  
}
export default ProtectedRoute;