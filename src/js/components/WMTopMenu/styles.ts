import styled from "styled-components";

export const Container = styled.div`
    grid-area: 'HEADER';
    display: flex;
    align-items: center;
    background-color: var(--secondary);
    padding: 0px;
    
    z-index: 1;
    height: 39px;
    width: calc(100vw - 39px);

        transition: opacity .5s, transform .2s, background-color .2s;
        &:hover{
            /* background-color: var(--active); */
            cursor: text;
        }
    }   
`;

export const Title = styled.div`
    color: var(--white);
    font-size: 12px;
    margin-left: 18px;
    font-weight: bold;
    color: var(--white);
    opacity: 0.6;
    cursor: text;

`;



