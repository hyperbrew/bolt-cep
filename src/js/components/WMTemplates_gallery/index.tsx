import React from "react";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";

import {Container} from "./styles";

import ImageMasonry from "../masonry";


const WM_Templates_Gallery: React.FC = () => {
    return(

    <Container>
     

    {/* <WM_Uploader/> */}
   
    <ImageMasonry/>
    
        
     
     
    </Container>

    )


};

export default WM_Templates_Gallery;




  