import React, {useState} from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

import { SidebarData } from './sideBarData';
import './Navbar.css';
import {IconContext} from 'react-icons'
import {HashRouter as Router, Routes, Route, Navigate, Link} from 'react-router-dom';

import WmHome from "../../main/pages/Home";
import WM_Templates from "../../main/pages/Templates"
import WM_Channels from "../../main/pages/Channels"


function NavBar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <>
        <IconContext.Provider value={{color:"#ffffff"}}>
        <div className="navbar">
            <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar}/>
            </Link>
        </div>
        <nav className={sidebar? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items' onClick={showSidebar}>
                <li className='navbar-togle'>
                    <Link to='#' className='menu-bars'>
                        <AiIcons.AiOutlineClose/>
                    </Link>
                </li>
                {SidebarData.map((item, index) => {
                    return(
                        <li key={index} className={item.cName} onClick={()=>{console.log(window.cep_node)}}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
        </IconContext.Provider>

        <Routes>
      
        {/* <Route path = {cepBasename} element={<WmHome/>}/> */}
        
        {/* <Route path='/main' element={<WmHome/>}/> */}
       
        <Route path='/home' element={<WmHome/>}/>
        <Route path='/templates' element={<WM_Templates/>} />
        <Route path='/channels' element={<WM_Channels/>} />
      </Routes>


        </>
    )
}

export default NavBar
