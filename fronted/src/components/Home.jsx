import Header from "./Header";
import Sidebar from "./sidebar";
import ChatArea from "./Chat";
import { useSelector } from "react-redux";
import {io} from "socket.io-client";
import { useEffect, useState } from "react";
let socket=io("https://quick-chat-app-server-8u1l.onrender.com");
let Home = () => {
  let {selectedChat,user}=useSelector(state=>state.userReducer);
  let [onlineUser,setOnlineUser]=useState([]);
  useEffect(()=>{
    if(user){
      socket.emit('join-room',user._id);
      socket.emit("user-login",user._id);
      socket.on("online-user",onlineusers=>{
        setOnlineUser(onlineusers);
      })

      socket.on("online-users-updated",onlineusers=>{
        setOnlineUser(onlineusers);
      })
    }
  },[user,onlineUser])
  return (
    <div className="home-page">
      <Header socket={socket}></Header>
      <div className="main-content">
        <Sidebar socket={socket} onlineUser={onlineUser}></Sidebar>
       {selectedChat && <ChatArea socket={socket}></ChatArea>}
      </div>
    </div>
  );
};
export default Home;
