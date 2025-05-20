import {createSlice} from "@reduxjs/toolkit";
let usersSlice=createSlice({
  name:"user",
  initialState:{
    user:null,
    allUsers:[],
    allChats:[],
    selectedChat:null,
  },
  reducers:{
    setUser:(state,action)=>{state.user=action.payload},
    setAllUsers:(state,action)=>{state.allUsers=action.payload},
    setAllChats:(state,action)=>{state.allChats=action.payload},
    setSelectedChat:(state,action)=>{state.selectedChat=action.payload},
  }
})

export let {setUser,setAllUsers,setAllChats,setSelectedChat}=usersSlice.actions;
export default usersSlice.reducer;