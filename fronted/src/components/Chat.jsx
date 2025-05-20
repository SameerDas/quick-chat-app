import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../apiCalls/message";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import moment from "moment";
import { clearUnreadMessageCount } from "../apiCalls/chat";
import store from "./../redux/store";
import { setAllChats } from "../redux/usersSlice";
import EmojiPicker from "emoji-picker-react";
let ChatArea = ({socket}) => {
  let { selectedChat, user,allChats } = useSelector((state) => state.userReducer);
  let selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  let dispatch = useDispatch();
  let [message, setMessage] = useState("");
  let [allMessages, setAllMessages] = useState([]);
  let [typing,setTyping]=useState(false);
  let [showEmojiPicker,setShowEmojiPicker]=useState(false);
  let [data,setData]=useState(null);
  let sendMessage = async (image) => {
    let response = null;
    // console.log(message);

    try {
      let newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image:image,
      };
      socket.emit('send-message',{
        ...newMessage,
        members:selectedChat.members.map(m=>m._id),
        read:false,
        createdAt:moment().format('YYYY-MM-DD hh:mm:ss')
      })
      // dispatch(showLoader());
      response = await createNewMessage(newMessage);
      // dispatch(hideLoader());
      if (response.success) {
        setMessage("");
        setShowEmojiPicker(false);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  let getTotalMessage = async () => {
    let response = null;
    // console.log(message);

    try {
      dispatch(showLoader());
      response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());
      // console.log(response.data);
      
      if (response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  let clearUnreadMessages = async () => {
    let response = null;
    // console.log(message);

    try {
      socket.emit("clear-unread-message",{
        chatId:selectedChat._id,
        members:selectedChat.members.map(m=>m._id)
      })
      // dispatch(showLoader());
      response = await clearUnreadMessageCount(selectedChat._id);
      // dispatch(hideLoader());
      
      if (response.success) {
        allChats.map(chat=>{
          if(chat._id===selectedChat._id){
            // console.log(response);
            return response.data;
          }
          return chat;
        })
      }
    }catch (error) {
      // dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  let formatTime=(timestamp)=>{
    let now= moment();
    let messageTime = moment(timestamp);
    
    let difference = now.startOf('day').diff(messageTime.startOf('day'), 'days');
    // let difference=now.diff(moment(timestamp),'days');  // result in days.
    // console.log(difference);
    
    if(difference<1){
      return `Today ${moment(timestamp).format("hh:mm A")}`;
    }
    else if(difference===1){
       return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    }
    else{
       return moment(timestamp).format('MMM D,hh:mm A');
    }
  }

  let formatName=(user)=>{
    let fname=user.firstname.at(0).toUpperCase()+user.firstname.slice(1).toLowerCase();
    let lname=user.lastname.at(0).toUpperCase()+user.lastname.slice(1).toLowerCase();
    return fname+" "+lname;
  }

  let sendImage=async(e)=>{
    let file=e.target.files[0];
    let reader=new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend=async()=>{
      sendMessage(reader.result);
    }
  }

  useEffect(()=>{
    getTotalMessage();
    if(selectedChat?.lastMessage?.sender!==user._id){
      clearUnreadMessages();
    }

    socket.off("receive-message").on('receive-message',(message)=>{
      let selectedChat=store.getState().userReducer.selectedChat;
      if(selectedChat._id===message.chatId){
        setAllMessages(prevmsge=>[...prevmsge,message]);
      }
      if(selectedChat._id===message.chatId && message.sender!==user._id){
        clearUnreadMessages();
      }
    })
    socket.on("message-count-cleared",data=>{
      let selectedChat=store.getState().userReducer.selectedChat;
      let allChats=store.getState().userReducer.allChats;
      if(selectedChat._id===data.chatId){
        // Updating unread message count in chat object
        let updatedChat=allChats.map(chat=>{
          if(chat._id===data.chatId){
            return {...chat,unreadMessageCount:0}
          }
          return chat;
        })
        dispatch(setAllChats(updatedChat));
        // Updating read property in message object
        setAllMessages(prevmsg=>{
          return prevmsg.map(msg=>{
            return {...msg,read:true}
          })
        })
      }
    })

    socket.on('started-typing',(data)=>{
      setData(data);
      if(selectedChat._id===data.chatId && data.sender!==user._id){
        setTyping(true);
        setTimeout(()=>{
          setTyping(false);
        },2000)
      }
    })
    
  },[selectedChat])

  useEffect(()=>{
    let msgContainer=document.getElementById("main-chat-area");
    msgContainer.scrollTop=msgContainer.scrollHeight;
  },[allMessages,typing])
  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {formatName(selectedUser)}
          </div>
          <div className="main-chat-area" id="main-chat-area">
            {allMessages.map(msg=>{
              let isCurrentUserSender=msg.sender===user._id;
               return <div className="message-container" style={isCurrentUserSender?{justifyContent:'end'}:{justifyContents:'start'}}>
                  <div>
                    <div className={isCurrentUserSender?"send-message":"received-message"}>
                      <div>{msg.text}</div>
                      <div>{msg.image && <img src={msg.image} alt="image" height="120" width="120"/>}</div>
                      </div>
                    <div className="message-timestamp" style={isCurrentUserSender?{float:'right'}:{float:'left'}}>
                      {formatTime(msg.createdAt)} {isCurrentUserSender && msg.read &&
                       <i className="fa fa-check-circle" aria-hidden="true" style={{color:'green'}}></i>}
                      </div>
                  </div>
                </div>
            })}
            <div className="typing-indicator">
              {typing  && selectedChat?.members.map(m=>m._id).includes(data?.sender)&& <i>Typing...</i>}
              </div>
            </div>
            {showEmojiPicker && <div style={{width:"100%",display:"flex",padding:"0px 20px",justifyContent:"right"}}>
              <EmojiPicker  style={{width:"300px",height:"400px"}}onEmojiClick={(e)=>setMessage(message+e.emoji)}></EmojiPicker>
              </div>}
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                socket.emit('user-typing',{
                  chatId:selectedChat._id,
                  members:selectedChat.members.map(m=>m._id),
                  sender:user._id
                })
              }}
            />
            <label for="file">
            <i className="fa fa-picture-o send-image-btn"></i>
            <input
              type="file"
              id="file"
              style={{display:"none"}}
              accept="image/jpg,image/png,image/jpeg,image/gif"
              onChange={sendImage} />
            </label>
            <button
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick={()=>setShowEmojiPicker(!showEmojiPicker)}
            ></button>
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={()=>sendMessage("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatArea;
