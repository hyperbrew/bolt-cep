import React from "react";
import { css } from "@emotion/css";

export interface Props {
  src: string

  thumbPreview: string,
  
}


const PausedOverlay : React.FC<Props> = (
  
  thesrc
  
) => {


  const theThumb= thesrc.toString();

  return(
  <div>
   
    <img
    
      src={"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"}
      className={css`
        /* Thumbnail image expands to cover the player */
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        object-fit: cover;
      `}
    />
    <div
      className={css`
        /* Ensure the description text is displayed on top of the thumbnail image */
        z-index: 1;
        font-family: sans-serif;
        /* Position the text in the bottom-left corner of the overlay */
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0em;

        h1 {
          margin: 0 ;
        }
        p {
          margin: 0 
        }
      `}
    >

   
    </div>
  </div>
)
      };

export default PausedOverlay;
