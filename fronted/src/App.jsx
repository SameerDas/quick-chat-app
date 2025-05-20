import { Outlet } from "react-router-dom";
import './App.css'
import { Toaster } from "react-hot-toast";
import Loader from "./components/loader";
import { useSelector } from "react-redux";
function App() {
  let {loader}=useSelector(state=>state.loaderReducer);
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
   {loader && <Loader/>}
     <Outlet/>
    </>
  )
}

export default App;
