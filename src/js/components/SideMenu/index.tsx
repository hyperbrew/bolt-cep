import React from "react";
import MenuButton from "../MenuButton";
import MenuIcon from "../MenuIcon";
import {Container, Separator} from "./styles";
// import { wm_icons } from "../../assets/wm_icons";
import wmIcon from "../../assets/wm-icon.svg";


import { Link, useNavigate } from "react-router-dom";

import { IconHome, IconTemplates, IconChannels, IconUpload, IconUser } from "../../assets/wm_icons";






function alertMe(){

    alert("TESTE")
}

const SideMenu: React.FC = () => {


    return(
    <Container>

        <MenuIcon icon={wmIcon} alt={"WizzyMotion"} />
        <div style={{display:"flex", flexDirection:"column"}} >
        <Separator />


        <Link to={"/home"}>
        <MenuButton icon={<IconHome /> } isActive/>
        </Link>

        <Link to={"/templates"}>
        <MenuButton icon={<IconTemplates/>} />
        </Link>

        <Link to={"/channels"}>
        <MenuButton icon={<IconChannels/>} />
        </Link>
        <Link to={"/main"}>
        <MenuButton icon={<IconUpload/>}/>
        </Link>
        </div>
        <MenuButton icon={<IconUser/>}  />
        
    </Container>
    
    );

};

export default SideMenu;