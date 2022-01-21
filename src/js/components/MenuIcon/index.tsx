import React from "react";
import {Button} from "./styles";

export interface Props {
    icon?: string,
    alt?: string,
    isActive?: boolean
}

function consoleMe(){
    console.log("WizzyMotion Logo")    
}


const MenuIcon: React.FC<Props> = ({
    
    icon,
    alt,
}) => {
    
    return(
        <Button onClick={consoleMe} >
            <img src={icon} alt={alt} />
        </Button>
    )

};


export default MenuIcon;