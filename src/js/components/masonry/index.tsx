import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Masonry from "@mui/lab/Masonry";
import { useState, useEffect } from "react";
import { TemplateImg } from "./styles";
import {supabase} from "../../services/supabase";
import { createTheme, ThemeProvider } from "@mui/material";
import HoverVideoPlayer from "react-hover-video-player";

import PausedOverlay from "./PausedOverlay";
import LoadingOverlay from "./LoadingOverlay"


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,
      x7: 800,
      x8: 900,
      x9: 1000
    },
  },
});

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; 
    sm: true;
    md: true;
    lg: true;
    xl: true;
    x7: true;
    x8: true;
    x9: true;
  }
}


export default function ImageMasonry(){

  const [myCategories, setMyCategories] = useState([])
  const [category, setCategory] = useState([])
  
  useEffect(()=>{
    fetchCategories()
   
  }, [])
  
  async function fetchCategories(){
    const data : any = await supabase
    .from('categories')
    .select('*');
    setMyCategories(data.data);
    
    console.log("data: ", data.body)
    
    
  
  }
  

  

  // const sorted_by_id = myCategories.sort((a:any,b:any) => {
  //   return a.id - b.id
  // });


  return (

      <div>
     <ThemeProvider theme={theme}>   
    <Box sx={{ paddingLeft: "0px" , paddingRight: "9px", marginTop: "0px", paddingBottom: "9px"}}>
      <Masonry columns={{ xs: 2, sm: 2, md: 3 , lg: 4, xl: 5, x7: 6, x8: 7, x9:8 }} spacing={0.3} >
        {myCategories.map((item : any, index) => (
          <Stack key={index} >
            <button onClick={()=>{alert("Display Page for \""+item.name + "\" import!")} } style={{backgroundColor:"transparent", position: "relative", height:"100%", paddingRight:"2px"}}>

            {/* <TemplateImg 
              src={`${item.image}`}
              srcSet={`${item.image}`}
              alt={item.name}
              loading="lazy"
              style={{ borderRadius: 3 }}
              
            /> */}

<HoverVideoPlayer

  videoSrc={`${item.video_preview}`} style={{cursor:"pointer"}} restartOnPaused
  overlayTransitionDuration={0} 

 
  
  // We should display an image over the video while it is paused
  pausedOverlay={
    <img
      src={`${item.image}`}
      alt=""
      
      style={{
        // Make the image expand to cover the video's dimensions
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '0px',
        cursor: 'pointer'

      }}
    />
  
  }
/>
   
</button>
          </Stack>
        ))}
      </Masonry>
    </Box>
    </ThemeProvider>
    
    </div>

  );
}
