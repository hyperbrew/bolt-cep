import React from "react";
import ReactDOM from "react-dom";
import "../index.scss";
import Dashboard from "../views/dashboard/dashboard";
import Layout from "../components/layout";
import GlobalStyles from '../styles/GlobalStyles'
import Main from "./main"
import WM_Login from "./login"
import {HashRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';
import NavBar from "../components/NavBar";
import WmHome from "./pages/Home";
import WM_Templates from "./pages/Templates"
import WM_Channels from "./pages/Channels"
import WmNav from "./pages/Nav";



const posix = (str: string) => str.replace(/\\/g, "/");
const cepBasename = window.cep_node
  ? `${posix(window.cep_node.global.__dirname)}/`
  : "/";

  //@ts-ignore
const PrivateRoute = ({children, redirectTo}) =>{
  const isAuthenticated = localStorage.getItem("supabase.auth.token") !== null;
  console.log("isAuth", isAuthenticated)
  return isAuthenticated ? children : <Navigate to={redirectTo}/>
}  

ReactDOM.render(
  
  <React.StrictMode>
    
  <Router >

    <GlobalStyles />
    
    {/* <Main/> */}

    {/* <WmHome/> */}
     
     {/* <Layout/> */}
     
    {/* <Dashboard/> */}

    {/* <Main/> */}

    
    {/* <WM_Login/> */}
    
      
    {/* <NavBar/> */}
   
    
    
      <Routes>
      
        <Route path = {cepBasename} element={<WM_Login/>}/>
        <Route path='/' element={<WM_Login/>}/>
        <Route path='/main' element={<WM_Login/>}/>

        <Route path='/home' element={<PrivateRoute redirectTo={'/'}><WmHome/></PrivateRoute>}/>
        <Route path='/templates' element={<PrivateRoute redirectTo={'/'}><WM_Templates/></PrivateRoute>}/>
        <Route path='/channels' element={<PrivateRoute redirectTo={'/'}><WM_Channels/></PrivateRoute>}/>
      </Routes>
    </Router>


    
  </React.StrictMode> 
  ,
  document.getElementById("root")
);
