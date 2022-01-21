import styled from "styled-components";
import {Props} from '.';

export const Button = styled.button<Props>`

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 39px;
    height: 39px;
    
    margin-bottom: 0px;
    background-color: var(--background);
    

    cursor: pointer;
    position: fixed;
    z-index: 999;

`;