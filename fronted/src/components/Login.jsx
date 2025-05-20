import { useState } from "react";
import {Link} from "react-router-dom";
import { loginUser } from "../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
let Login=()=>{
  let dispatch=useDispatch();
  let [user,setUser]=useState({
    email:"",
    password:""
  })
  let handleLoginClick=async(event)=>{
    event.preventDefault();
    // console.log(user);
    let response=null;
    try{
      dispatch(showLoader());
      response=await loginUser(user);
      dispatch(hideLoader());
      if(response.success){
        toast.success(response.message);
        // console.log(response.token)
        localStorage.setItem('token',response.token);
        window.location.href="/";
      }else{
        toast.error(response.message);
      }
    }catch(error){
      dispatch(hideLoader());
      toast.error(response.message);
    }
  }
  return (
    
    <>
      <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={handleLoginClick}>
            <input type="email" placeholder="Email"
            onChange={(e)=>setUser({...user,email:e.target.value})}/>
            <input type="password" placeholder="Password" 
             onChange={(e)=>setUser({...user,password:e.target.value})}/>
            <button>Login</button>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to="/signup">Signup Here</Link>
            </span>
        </div>
        </div>
    </div>
    </>
  )
}
export default Login;