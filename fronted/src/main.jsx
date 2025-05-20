import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.jsx'
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {Provider} from "react-redux";
import store from './redux/store.jsx';
import Profile from './components/Profile.jsx';
let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element:<ProtectedRoute><Home /></ProtectedRoute> },
      { path: "profile", element:<ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/login", element: <Login/> },
      { path: "/signup", element: <Signup/> },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
   </StrictMode>
)
