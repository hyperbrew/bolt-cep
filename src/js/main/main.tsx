import React , {useEffect} from "react";
import ReactDOM from "react-dom";
import NavBar from "../components/NavBar";
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';

import WmHome from "./pages/Home";
import WM_Templates from "./pages/Templates"
import WM_Channels from "./pages/Channels"



// import logo from "../logo.svg";
// import "./main.scss";


const Main: React.FC = () => {



const posix = (str: string) => str.replace(/\\/g, "/");
const cepBasename = window.cep_node
  ? `${posix(window.cep_node.global.__dirname)}/`
  : "/main/";



  useEffect(()=>{

  
   
  }, [])




  return(


    <NavBar/>
    // <Router>
    
    
      
    // <NavBar/>
    
    //   <Routes>

    //     <Route path = {cepBasename} element={<WmHome/>}/>
    //     <Route path='/' element={<WmHome/>}/>
    //     <Route path='/templates' element={<WM_Templates/>} />
    //     <Route path='/channels' element={<WM_Channels/>} />
    //   </Routes>
    // </Router>

  );
};

export default Main;
