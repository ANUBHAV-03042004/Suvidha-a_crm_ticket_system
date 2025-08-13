import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div id="ghost">
        <div id="red">
          <div id="pupil" />
          <div id="pupil1" />
          <div id="eye" />
          <div id="eye1" />
          <div id="top0" />
          <div id="top1" />
          <div id="top2" />
          <div id="top3" />
          <div id="top4" />
          <div id="st0" />
          <div id="st1" />
          <div id="st2" />
          <div id="st3" />
          <div id="st4" />
          <div id="st5" />
          <div id="an1" />
          <div id="an2" />
          <div id="an3" />
          <div id="an4" />
          <div id="an5" />
          <div id="an6" />
          <div id="an7" />
          <div id="an8" />
          <div id="an9" />
          <div id="an10" />
          <div id="an11" />
          <div id="an12" />
          <div id="an13" />
          <div id="an14" />
          <div id="an15" />
          <div id="an16" />
          <div id="an17" />
          <div id="an18" />
        </div>
        <div id="shadow" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #ghost {
    position: relative;
    scale: 0.8;
    margin-bottom:5vh;
  }

  #red {
    animation: upNDown infinite 0.5s;
    position: relative;
    width: 140px;
    height: 140px;
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    grid-template-rows: repeat(14, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    grid-template-areas:
      "a1  a2  a3  a4  a5  top0  top0  top0  top0  a10 a11 a12 a13 a14"
      "b1  b2  b3  top1 top1 top1 top1 top1 top1 top1 top1 b12 b13 b14"
      "c1 c2 top2 top2 top2 top2 top2 top2 top2 top2 top2 top2 c13 c14"
      "d1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 d14"
      "e1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 e14"
      "f1 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 top3 f14"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4 top4"
      "st0 st0 an4 st1 an7 st2 an10 an10 st3 an13 st4 an16 st5 st5"
      "an1 an2 an3 an5 an6 an8 an9 an9 an11 an12 an14 an15 an17 an18";
  }

  @keyframes upNDown {
    0%,
    49% {
      transform: translateY(0px);
    }
    50%,
    100% {
      transform: translateY(-10px);
    }
  }

  #top0,
  #top1,
  #top2,
  #top3,
  #top4,
  #st0,
  #st1,
  #st2,
  #st3,
  #st4,
  #st5 {
    background-color: red;
  }

  #top0 {
    grid-area: top0;
  }

  #top1 {
    grid-area: top1;
  }

  #top2 {
    grid-area: top2;
  }

  #top3 {
    grid-area: top3;
  }

  #top4 {
    grid-area: top4;
  }

  #st0 {
    grid-area: st0;
  }

  #st1 {
    grid-area: st1;
  }

  #st2 {
    grid-area: st2;
  }

  #st3 {
    grid-area: st3;
  }

  #st4 {
    grid-area: st4;
  }

  #st5 {
    grid-area: st5;
  }

  #an1 {
    grid-area: an1;
    animation: flicker0 infinite 0.5s;
  }

  #an18 {
    grid-area: an18;
    animation: flicker0 infinite 0.5s;
  }

  #an2 {
    grid-area: an2;
    animation: flicker1 infinite 0.5s;
  }

  #an17 {
    grid-area: an17;
    animation: flicker1 infinite 0.5s;
  }

  #an3 {
    grid-area: an3;
    animation: flicker1 infinite 0.5s;
  }

  #an16 {
    grid-area: an16;
    animation: flicker1 infinite 0.5s;
  }

  #an4 {
    grid-area: an4;
    animation: flicker1 infinite 0.5s;
  }

  #an15 {
    grid-area: an15;
    animation: flicker1 infinite 0.5s;
  }

  #an6 {
    grid-area: an6;
    animation: flicker0 infinite 0.5s;
  }

  #an12 {
    grid-area: an12;
    animation: flicker0 infinite 0.5s;
  }

  #an7 {
    grid-area: an7;
    animation: flicker0 infinite 0.5s;
  }

  #an13 {
    grid-area: an13;
    animation: flicker0 infinite 0.5s;
  }

  #an9 {
    grid-area: an9;
    animation: flicker1 infinite 0.5s;
  }

  #an10 {
    grid-area: an10;
    animation: flicker1 infinite 0.5s;
  }

  #an8 {
    grid-area: an8;
    animation: flicker0 infinite 0.5s;
  }

  #an11 {
    grid-area: an11;
    animation: flicker0 infinite 0.5s;
  }

  @keyframes flicker0 {
    0%,
    49% {
      background-color: red;
    }
    50%,
    100% {
      background-color: transparent;
    }
  }

  @keyframes flicker1 {
    0%,
    49% {
      background-color: transparent;
    }
    50%,
    100% {
      background-color: red;
    }
  }

  #eye {
    width: 40px;
    height: 50px;
    position: absolute;
    top: 30px;
    left: 10px;
  }

  #eye::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 50px;
    transform: translateX(10px);
    display: block;
    position: absolute;
  }

  #eye::after {
    content: "";
    background-color: white;
    width: 40px;
    height: 30px;
    transform: translateY(10px);
    display: block;
    position: absolute;
  }

  #eye1 {
    width: 40px;
    height: 50px;
    position: absolute;
    top: 30px;
    right: 30px;
  }

  #eye1::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 50px;
    transform: translateX(10px);
    display: block;
    position: absolute;
  }

  #eye1::after {
    content: "";
    background-color: white;
    width: 40px;
    height: 30px;
    transform: translateY(10px);
    display: block;
    position: absolute;
  }

  #pupil {
    width: 20px;
    height: 20px;
    background-color: blue;
    position: absolute;
    top: 50px;
    left: 10px;
    z-index: 1;
    animation: eyesMovement infinite 3s;
  }

  #pupil1 {
    width: 20px;
    height: 20px;
    background-color: blue;
    position: absolute;
    top: 50px;
    right: 50px;
    z-index: 1;
    animation: eyesMovement infinite 3s;
  }

  @keyframes eyesMovement {
    0%,
    49% {
      transform: translateX(0px);
    }
    50%,
    99% {
      transform: translateX(10px);
    }
    100% {
      transform: translateX(0px);
    }
  }

  #shadow {
    background-color: black;
    width: 140px;
    height: 140px;
    position: absolute;
    border-radius: 50%;
    transform: rotateX(80deg);
    filter: blur(20px);
    top: 80%;
    animation: shadowMovement infinite 0.5s;
  }

  @keyframes shadowMovement {
    0%,
    49% {
      opacity: 0.5;
    }
    50%,
    100% {
      opacity: 0.2;
    }
  }`;

export default Loader;
