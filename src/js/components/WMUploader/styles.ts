import styled from "styled-components";

export const Container = styled.div`
    
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: center;
    
    color: var(--white);
    border: 1px dashed var(--white);
    
    background-color: var(--secondary);

    z-index: 1;
    max-width: 240px;
    
    width: 100%;
    min-height: 135px;
    
    
    border-radius: 9px;
    margin-bottom: 18px;
    margin-top: 9px;
`;

export const Button = styled.button`
max-width: 200px;
padding: 12px;
background-color: var(--active);
color: var(--white);
border-radius: 9px;
cursor: pointer;
    
`;

export const ImageThumb = styled.img`
    width: 480px;
    height: 270px;
    position: absolute;
    z-index: -1;
    padding: 3px;
    border-radius: 9px;

`;