import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import { createNewChat } from "../apiCalls/chat";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../redux/usersSlice";
import moment from "moment";
import { useEffect } from "react";
import store from "../redux/store";
let UserList=({searchKey,socket,onlineUser})=>{
  let {allUsers,allChats,user:currentUser,selectedChat}=useSelector(state=>state.userReducer);
  let dispatch=useDispatch();
  let startNewChat=async(searchedUserId)=>{
    let response=null;
    try{
      dispatch(showLoader());
      response=await createNewChat([currentUser._id,searchedUserId]);
      dispatch(hideLoader());
      if(response.success){
        toast.success(response.message);
        let newChat=response.data;
        let updatedChat=[...allChats,newChat];
        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
      }
    }catch(error){
      toast.error(response.message);
      dispatch(hideLoader());
    }
  }

  let openChat=(selectedUserId)=>{
    let chat=allChats.find(chat=>
      chat.members.map(m=>m._id).includes(currentUser._id)&&
      chat.members.map(m=>m._id).includes(selectedUserId)
    )
    if(chat){
      dispatch(setSelectedChat(chat));
    }
  }

  let isSelectedChat=(user)=>{
    if(selectedChat){
      return selectedChat.members.map(m=>m._id).includes(user._id);
    }
    return false;
  }

  let getLastMessage=(userId)=>{
    let chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId));
    if(!chat || !chat.lastMessage){
      return "";
    }else{
      let msgPrefix=chat?.lastMessage?.sender===currentUser._id? "You: ":"";
      return msgPrefix+chat?.lastMessage?.text?.substring(0,25);
    }
  }

  let getLastMessageTimeStamp=(userId)=>{
    let chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId));
    if(!chat || !chat?.lastMessage){
      return "";
    }else{
      return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
    }
  }

  let formatName=(user)=>{
    let fname=user.firstname.at(0).toUpperCase()+user.firstname.slice(1).toLowerCase();
    let lname=user.lastname.at(0).toUpperCase()+user.lastname.slice(1).toLowerCase();
    return fname+" "+lname;
  }

  useEffect(()=>{
    socket.off("set-message-count").on("set-message-count",(message)=>{
      let selectedChat=store.getState().userReducer.selectedChat;
      let allChats=store.getState().userReducer.allChats;
      if(selectedChat?._id!==message.chatId){
        let updatedChat=allChats.map(chat=>{
          if(chat._id===message.chatId){
            return{
              ...chat,
              unreadMessageCount:(chat?.unreadMessageCount || 0)+1,
              lastMessage:message
            }
          }
          return chat;
        })
        allChats=updatedChat;
      }
      // 1. find the latest chat
      let latestChat=allChats.find(chat=>chat._id===message.chatId);

      //2. get all other chats  except latest chat
      let otherChats=allChats.filter(chat=>chat._id!==message.chatId);

      // 3. create a new array latest chat on top & then other chats
      allChats=[latestChat,...otherChats];
      dispatch(setAllChats(allChats));
    })
  },[])

  let getUnreadMessageCount=(userId)=>{
    let chat=allChats.find(chat=>chat.members.map(m=>m._id).includes(userId));
    if(chat && chat.unreadMessageCount && chat.lastMessage.sender!==currentUser._id){
      return <div className="unread-message-counter"> {chat.unreadMessageCount}</div>;
    }else{
      return "";
    }
  }

  let getData=()=>{
    if(searchKey === ""){
      return allChats;
    }else{
      allUsers?.filter(user=>{
        return (user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchKey.toLowerCase()))
      });
    }
  }
  return(
    allUsers
    .filter(user=>{
      return(
        (
          user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchKey.toLowerCase())&& searchKey
        )
        // || (allChats.some(chat=>chat.members.map(m=>m._id).includes(user._id)))
      )
    })
    // getData()
    .map(obj=>{
      let user=obj;
      if(obj.members){
        user=obj.members.find(mem=>mem._id !==currentUser._id);
      }
    return <div className="user-search-filter" onClick={()=>openChat(user._id)} key={user._id}>
             <div className={isSelectedChat(user) ?"selected-user":"filtered-user"}>
               <div className="filter-user-display">
           {user.profilePic && <img src={user.profilePic} alt="Profile Pic" className="user-profile-image"
           style={onlineUser.includes(user._id)?{border:"lightsalmon 3px solid"}:{}}/> }
          { !user.profilePic && <div className="user-default-profile-pic"
            style={onlineUser.includes(user._id)?{border:"green 3px solid"}:{}}>
               {user.firstname.charAt(0).toUpperCase()+user.lastname.charAt(0).toUpperCase()}
           </div>}
           <div className="filter-user-details">
               <div className="user-display-name">{formatName(user)}</div>
                   <div className="user-display-email">{getLastMessage(user._id)||user.email}</div>
           </div>
            <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">{getLastMessageTimeStamp(user._id)}</div>
            </div>
               { !allChats.find(chat=>chat.members.map(m=>m._id).includes(user._id))&&
               <div className="user-start-chat">
                  <button className="user-start-chat-btn" onClick={()=>startNewChat(user._id)}>
                    Start Chat
                  </button>
               </div>
               }
           </div>
       </div>                        
      </div>
    })
  )
}
export default UserList;