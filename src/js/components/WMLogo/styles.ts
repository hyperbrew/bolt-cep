import styled from "styled-components";
import {Props} from '.';

export const Button = styled.button<Props>`

    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: auto;
    height: 39px;
    padding: 9px;
    z-index: 2;
    
    margin-bottom: 0px;
    background-color: var(--background);
    
`;