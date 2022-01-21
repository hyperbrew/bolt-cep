import React from "react";
import { css, keyframes } from "@emotion/css";

const loadingOverlaySpinnerAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingOverlay: React.FC = () => {
  return(
  <div
    className={css`
      /* Loading overlay covers the player */
      width: 100%;
      height: 100%;
      /* Loading overlay has semi-transparent background so the player
          will be darkened while it's visible */
      background-color: rgba(0, 0, 0, 0.7);
      /* Center the spinner inside of the overlay */
      display: flex;
      justify-content: center;
      align-items: center;
    `}
  >
    <div
      className={css`
        width: 4em;
        height: 4em;
        border: 6px solid white;
        border-radius: 50%;
        border-color: white white transparent transparent;
        animation: ${loadingOverlaySpinnerAnimation} 1s linear infinite;
      `}
    />
  </div>
)
  }
  ;

export default LoadingOverlay;
