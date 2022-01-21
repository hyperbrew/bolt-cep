import styled from "styled-components";
import HoverVideoPlayer from "react-hover-video-player";

import PausedOverlay from "./PausedOverlay";
import LoadingOverlay from "./LoadingOverlay"

export interface Props {
    icon?: any,
    alt?: string,
    isActive?: boolean,
    active?: boolean,
    thePath?: string,
    name?: string
    
}

export const TemplateImg = styled.img`
width: 100%;
object-fit: contain;
opacity: 1;
/* filter: grayscale(100%); */

transition: opacity .3s, transform .2s, z-index .2s, filter .2s;
&:hover{
        opacity: 1;
        cursor: pointer;
        /* filter: grayscale(0%); */
    }
`;

