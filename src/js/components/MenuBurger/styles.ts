import styled from "styled-components";
import {Props} from '.';

export const Button = styled.button<Props>`


    width: 39px;
    height: 39px;

    margin-top: 0px;
    background-color: var(--background);
    position: relative;

    z-index: 9;

    cursor: pointer;
    position: relative;
    opacity: 0.3;

    transition: background-color .3s, opacity .3s;
    &.active, &:hover{
        opacity: 1;
    }


`;