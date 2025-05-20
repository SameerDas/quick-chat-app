import {createSlice} from "@reduxjs/toolkit";
let loaderSlice=createSlice({
  name:"loader",
  initialState:{loader:false},
  reducers:{
    showLoader:(state)=>{state.loader=true},
    hideLoader:(state)=>{state.loader=false}
  }
})

export let {showLoader,hideLoader}=loaderSlice.actions;
export default loaderSlice.reducer;