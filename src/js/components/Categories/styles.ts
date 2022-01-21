import styled from "styled-components";

export const Container = styled.div`
    grid-area: 'HEADER';
    display: flex;
    flex-direction: row;
    align-items: center;


    padding: 0px;
    z-index: 1;
    height: 120px;
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left:9px;
    padding-right: 6px;
    width: calc(100vw - 39px);
    overflow-x: scroll;
    ::-webkit-scrollbar{
        display: none;
    }
    overflow-y: hidden;
    
    
`;

export const Title = styled.div`
    color: var(--white);
    font-size: 9px;
    margin-top: 6px;
    font-weight: bold;
    color: var(--white);
    opacity: 0.5;
    text-align: center;
    align-content: center;
`;

export const CategoryContainer = styled.div`
    grid-area: 'HEADER';
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    z-index: 1;
    height: 100%;
    padding-top: 9px;
    padding-left: 3px;
    padding-right: 3px;
    height: 90px;
    object-fit: fill;

`;

export const CategoryImg = styled.img`

max-width: 51px;
height: 51px;
border-radius: 12%;
margin-right: 6px;
margin-left: 6px;
object-fit: cover;
border: 1px solid var(--secondary);

transition: transform .3s;
&:hover{
        transform: scale(1.1);
    }
    cursor: pointer;


`;


