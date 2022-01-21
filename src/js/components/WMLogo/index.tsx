import React from "react";
import {Button} from "./styles";

export interface Props {
    icon?: any,
    alt?: string
}


const WMLogo: React.FC<Props> = ({
    icon,
    alt,
    
}) => {
    return(
        <Button>
            
            {icon}
            {alt}
           
        </Button>
    )

};


export default WMLogo;