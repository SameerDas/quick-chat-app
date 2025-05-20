import { useState } from "react";
import {Link} from "react-router-dom";
import {signupUser} from "./../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
let Signup=()=>{
    let dispatch=useDispatch();
    let[user,setUser]=useState({
        firstname:"",
        lastname:"",
        email:"",
        password:""
    })
    let handleInputChange=(e)=>{
        setUser({...user,[e.target.name]:e.target.value});
    }
    let handleSubmitButton=async(event)=>{
        event.preventDefault();
        // console.log(user);
        let response=null;
        try{
            dispatch(showLoader());
            response=await signupUser(user);
            dispatch(hideLoader());
            if(response.success){
                toast.success(response.message);
            }else{
                toast.error(response.message);
            }
        }catch(err){
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
                  <h1>Create Account</h1>
              </div>
              <div className="form">
                  <form onSubmit={handleSubmitButton}>
                      <div className="column">
                          <input type="text" placeholder="First Name" name="firstname" 
                           onChange={handleInputChange}/>
                          <input type="text" placeholder="Last Name" name="lastname" 
                          onChange={handleInputChange}/>
                      </div>
                      <input type="email" placeholder="Email" name="email" 
                      onChange={handleInputChange}/>
                      <input type="password" placeholder="Password" name="password" 
                      onChange={handleInputChange}/>
                      <button>Sign Up</button>
                  </form>
              </div>
              <div className="card_terms">
                  <span>Already have an account?
                      <Link to="/login">Login Here</Link>
                  </span>
              </div>
          </div>
      </div>
    </>
  )
}
export default Signup;