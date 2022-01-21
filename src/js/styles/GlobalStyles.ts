import {createGlobalStyle} from "styled-components";

export default createGlobalStyle`
    *{
       margin: 0;
       padding: 0;
       box-sizing: border-box;
       -webkit-font-smoohing: antialiased;
       
       
    }
    
    html, body, #root {
      height: 100%;
      background-color: #121212;
    } 

    *, button, input {
      font-family: 'Montserrat', sans-serif;
      border: 0;
      outline: 0;
    }

    :root {

    --background: #121212;
    --active: #666666; 
    
    --primary: #151515;
    --secondary: #272727;
    --tertiary: #666666;
    --quaternary: #999999;
    --quinary: #121212;
    --senary: #828386;
 
    --adobeblue: #008EE7;
    --mintgreen: #00FF44;
    --pink: #FF0058;
    --white: #fff;
    --gray: #8a8c90;
    --chat-input: rgb(64,68,75);
    --symbol: #74777a;
 
    --notification: #f84a4b;
    --discord: #6e86d6;
    --mention-detail: #f9a839;
    --mention-message: #413f3f;
 
    --link: #5d80d6;
 
    --rocketseat: #6633cc;
    }

    .home,  .channels {
      display: flex;
      height: 100vh;
      width: calc(100vw - 39px);
      align-items: center;
      justify-content: center;
      font-size: 0.5rem;
      color: #cc3366;
     
      background-color: #151515;
      z-index: 99;
      
    }

.templates{
      display: flex;
      height: 100vh;
      width: calc(100vw - 39px);
      align-items: center;
      justify-content: center;
      margin-left: 0px;
      font-size: 0.5rem;
      color: #cc3366;


     
      background-color: var(---rocketseat);
   
      
    }

    `;

   