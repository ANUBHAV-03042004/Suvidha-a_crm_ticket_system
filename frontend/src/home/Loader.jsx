import React from 'react';
import styled from 'styled-components';

export const Loader = () => {
  return (
    <StyledWrapper>
      <div className="earth">
        <div className="earth-loader">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M29.4,-17.4C33.1,1.8,27.6,16.1,11.5,31.6C-4.7,47,-31.5,63.6,-43,56C-54.5,48.4,-50.7,16.6,-41,-10.9C-31.3,-38.4,-15.6,-61.5,-1.4,-61C12.8,-60.5,25.7,-36.5,29.4,-17.4Z" fill="#7CC133" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M31.7,-55.8C40.3,-50,45.9,-39.9,49.7,-29.8C53.5,-19.8,55.5,-9.9,53.1,-1.4C50.6,7.1,43.6,14.1,41.8,27.6C40.1,41.1,43.4,61.1,37.3,67C31.2,72.9,15.6,64.8,1.5,62.2C-12.5,59.5,-25,62.3,-31.8,56.7C-38.5,51.1,-39.4,37.2,-49.3,26.3C-59.1,15.5,-78,7.7,-77.6,0.2C-77.2,-7.2,-57.4,-14.5,-49.3,-28.4C-41.2,-42.4,-44.7,-63,-38.5,-70.1C-32.2,-77.2,-16.1,-70.8,-2.3,-66.9C11.6,-63,23.1,-61.5,31.7,-55.8Z" fill="#7CC133" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M30.6,-49.2C42.5,-46.1,57.1,-43.7,67.6,-35.7C78.1,-27.6,84.6,-13.8,80.3,-2.4C76.1,8.9,61.2,17.8,52.5,29.1C43.8,40.3,41.4,53.9,33.7,64C26,74.1,13,80.6,2.2,76.9C-8.6,73.1,-17.3,59,-30.6,52.1C-43.9,45.3,-61.9,45.7,-74.1,38.2C-86.4,30.7,-92.9,15.4,-88.6,2.5C-84.4,-10.5,-69.4,-20.9,-60.7,-34.6C-52.1,-48.3,-49.8,-65.3,-40.7,-70C-31.6,-74.8,-15.8,-67.4,-3.2,-61.8C9.3,-56.1,18.6,-52.3,30.6,-49.2Z" fill="#7CC133" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path transform="translate(100 100)" d="M39.4,-66C48.6,-62.9,51.9,-47.4,52.9,-34.3C53.8,-21.3,52.4,-10.6,54.4,1.1C56.3,12.9,61.7,25.8,57.5,33.2C53.2,40.5,39.3,42.3,28.2,46C17,49.6,8.5,55.1,1.3,52.8C-5.9,50.5,-11.7,40.5,-23.6,37.2C-35.4,34,-53.3,37.5,-62,32.4C-70.7,27.4,-70.4,13.7,-72.4,-1.1C-74.3,-15.9,-78.6,-31.9,-73.3,-43C-68.1,-54.2,-53.3,-60.5,-39.5,-60.9C-25.7,-61.4,-12.9,-56,1.1,-58C15.1,-59.9,30.2,-69.2,39.4,-66Z" fill="#7CC133" />
          </svg>
        </div>
        <p>Connecting...</p>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
.earth{
display:flex;
flex-direction:column;
width:100vw;
height:100vh;
justify-content:center;
align-items:center;
}
  .earth-loader {
    --watercolor: #3344c1;
    --landcolor: #7cc133;
    width: 7.5em;
    height: 7.5em;
    background-color: var(--watercolor);
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    box-shadow:
      inset 0em 0.5em rgb(255, 255, 255, 0.25),
      inset 0em -0.5em rgb(0, 0, 0, 0.25);
    border: solid 0.15em white;
    animation: startround 1s;
    animation-iteration-count: 1;
  }

  .earth p {
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.25em;
    font-size: 1.25em;
    font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  }

  .earth-loader svg:nth-child(1) {
    position: absolute;
    bottom: -2em;
    width: 7em;
    height: auto;
    animation: round1 5s infinite linear 0.75s;
  }

  .earth-loader svg:nth-child(2) {
    position: absolute;
    top: -3em;
    width: 7em;
    height: auto;
    animation: round1 5s infinite linear;
  }
  .earth-loader svg:nth-child(3) {
    position: absolute;
    top: -2.5em;
    width: 7em;
    height: auto;
    animation: round2 5s infinite linear;
  }
  .earth-loader svg:nth-child(4) {
    position: absolute;
    bottom: -2.2em;
    width: 7em;
    height: auto;
    animation: round2 5s infinite linear 0.75s;
  }

  @keyframes startround {
    0% {
      filter: brightness(500%);
      box-shadow: none;
    }
    75% {
      filter: brightness(500%);
      box-shadow: none;
    }
    100% {
      filter: brightness(100%);
      box-shadow:
        inset 0em 0.5em rgb(255, 255, 255, 0.25),
        inset 0em -0.5em rgb(0, 0, 0, 0.25);
    }
  }

  @keyframes round1 {
    0% {
      left: -2em;
      opacity: 100%;
      transform: skewX(0deg) rotate(0deg);
    }
    30% {
      left: -6em;
      opacity: 100%;
      transform: skewX(-25deg) rotate(25deg);
    }
    31% {
      left: -6em;
      opacity: 0%;
      transform: skewX(-25deg) rotate(25deg);
    }
    35% {
      left: 7em;
      opacity: 0%;
      transform: skewX(25deg) rotate(-25deg);
    }
    45% {
      left: 7em;
      opacity: 100%;
      transform: skewX(25deg) rotate(-25deg);
    }
    100% {
      left: -2em;
      opacity: 100%;
      transform: skewX(0deg) rotate(0deg);
    }
  }

  @keyframes round2 {
    0% {
      left: 5em;
      opacity: 100%;
      transform: skewX(0deg) rotate(0deg);
    }
    75% {
      left: -7em;
      opacity: 100%;
      transform: skewX(-25deg) rotate(25deg);
    }
    76% {
      left: -7em;
      opacity: 0%;
      transform: skewX(-25deg) rotate(25deg);
    }
    77% {
      left: 8em;
      opacity: 0%;
      transform: skewX(25deg) rotate(-25deg);
    }
    80% {
      left: 8em;
      opacity: 100%;
      transform: skewX(25deg) rotate(-25deg);
    }
    100% {
      left: 5em;
      opacity: 100%;
      transform: skewX(0deg) rotate(0deg);
    }
  }`;

