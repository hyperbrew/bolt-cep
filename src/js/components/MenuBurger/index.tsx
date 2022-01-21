import React from "react";
import {Button} from "./styles";

import { useNavigate } from "react-router-dom";
import { supabase } from '../../services/supabase';

export interface Props {
    icon?: any,
    alt?: string
}



const MenuBurger: React.FC<Props> = ({
    icon,
    alt
}) => {
    let navigate = useNavigate();

    const logOut = async () =>{

        let { error } = await supabase.auth.signOut()
        navigate("/")
  
      }


    return(
        <Button onClick={logOut}>
            {icon}
            {alt}
        </Button>
    )

};


export default MenuBurger;


