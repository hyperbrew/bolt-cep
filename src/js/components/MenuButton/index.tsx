import React, {useState, useEffect, Component} from "react";
import {Button} from "./styles";
import { Link } from "react-router-dom";

export interface Props {
    icon?: any,
    alt?: string,
    isActive?: boolean,
    active?: boolean,
    thePath?: string,
    name?: string
    
}




const MenuButton: React.FC<Props> = ({
    icon,
    alt,
    active,
    thePath,
    name
 

}) => {
    
    const [reactive, setActive] = useState<boolean>(true)

    function alertMe(text:any){

        alert(text);
    }

    return(
       
        <Button onClick={() => {
            
            setActive(!reactive)
            // alert("action"
            }} 
            isActive={(!reactive)}
            >
            
      
            {icon}
            {alt}
            
       
            
        </Button>

      
       
    )

};


export default MenuButton;


