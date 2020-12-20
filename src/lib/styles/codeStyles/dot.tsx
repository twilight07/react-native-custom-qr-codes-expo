/*

dot.js

This file exports a function for drawing a dot centre piece for a QRCode

  --Geoff Natin 11/1/18 17:41

*/
import React, { Component } from "react";
import { Circle } from "react-native-svg";

//Returns an SVG Element for a piece of the 'dot' codeStyle
export const drawDotPiece = (x, y, modules, pieceProperties, props) => {
  const length = modules.length;
  const width = props.size;
  const height = props.size;
  const xsize = width / (length + 2 * props.padding);
  const ysize = height / (length + 2 * props.padding);
  const px = x * xsize + props.padding * xsize + xsize / 2;
  const py = y * ysize + props.padding * ysize + ysize / 2;
  return <Circle key={px + ":" + py} cx={px} cy={py} r={xsize / 3} fill={props.color} />;
};
