import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconHome, IconTemplates, IconChannels, IconUpload, IconUser } from "../../assets/wm_icons";

export const SidebarData = [
    {

        title: 'Home',
        path: '/home',
        icon: <IconHome/>,
        cName: 'nav-text'
    },
    {

        title: 'Templates',
        path: '/templates',
        icon: <IconTemplates/>,
        cName: 'nav-text'
    },
    {

        title: 'Channels',
        path: '/channels',
        icon: <IconChannels/>,
        cName: 'nav-text'
    },
    {

        title: 'Login',
        path: '/',
        icon: <IconUpload/>,
        cName: 'nav-text'
    },
    {

        title: 'Messages',
        path: '/messages',
        icon: <IconChannels/>,
        cName: 'nav-text'
    },
    {

        title: 'Profile',
        path: '/profile',
        icon: <IconUser/>,
        cName: 'nav-text'
    },

]