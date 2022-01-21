import styled from "styled-components";
import {Props} from '.';

export const Button = styled.button<Props>`

    
    width: 39px;
    height: 39px;
    align-items: center;
    justify-content: center;
   
    

    background-color: ${props => props.isActive ? 'var(--background)' : 'var(--background)'};

    
    position: relative;
    opacity: ${props => props.isActive ? '1' : '0.25'};

    transition: background-color .4s, opacity .3s, transform .2s;
    &.active, &:hover{
        background-color: var(--active);
        opacity: 1;
        
    }
    cursor: pointer;

`;

