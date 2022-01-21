import styled from "styled-components";
import GlobalStyles from "../../styles/GlobalStyles";

export const Container = styled.div`
    /* grid-area: 'SIDEMENU'; */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background);
    
    
    height: 100vh;
    width: 40px;
    
    border-right: 1px solid var(--secondary);
    /* box-shadow: 1px 6px 6px #000; */

    overflow-x: none;
    overflow-y: scroll;
    
    ::-webkit-scrollbar{
        display: none;
    }

    /* transition: width .3s;
    &:hover{
        width: 80px;
    } */
    
`;

export const Separator = styled.div`
    width: 39px;
    height: 39px;
    background-color: var(--background);
    margin-top: 40px;
`;
