import styled from "styled-components";

export const Container = styled.div`
    grid-area: 'CONTENT';
    display: flex;
    flex-direction: column;
    
    
    background-color: var(--background);
    padding-left: 18px;
    z-index: 1;
    width: calc(100vw - 39px);
    height: calc(100vh - 39px);
    
    overflow-y: scroll;
    ::-webkit-scrollbar{
        display: none;
        width: 1px;
        
        
    };

    ::-webkit-scrollbar-thumb {
    background: var(--secondary);
    border-radius: 0px;
    
    
    }
    ::-webkit-scrollbar-thumb:hover {
    background: var(--active);
    }

    color: var(--active);
    font-size: 12px;
    
`;










