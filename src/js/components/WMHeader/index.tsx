import React from "react";

import {Container} from "./styles"
import MenuBurger from "../MenuBurger";
import WMLogo from "../WMLogo";
import hamburger from "../../assets/hamburger.svg"
import { WmLogo, WmLogoText, IconBurger } from "../../assets/wm_icons";


const WMHeader: React.FC = () => {

 


    return(

    <Container>
        <WMLogo icon={<WmLogoText />}>  </WMLogo>
        
        <MenuBurger icon={<IconBurger />} ></MenuBurger>
        

    </Container>

    )


};

export default WMHeader;