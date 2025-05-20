import { useState } from "react";
import Search from "./Search";
import UserList from "./userList";
let Sidebar = ({socket,onlineUser}) => {
  let [searchKey,setSearchKey]=useState("");
  return (
    <div className="app-sidebar">
      <Search searchKey={searchKey} setSearchKey={setSearchKey}></Search>
    <UserList searchKey={searchKey} socket={socket} onlineUser={onlineUser}></UserList>
    </div>
  )
}
export default Sidebar;
