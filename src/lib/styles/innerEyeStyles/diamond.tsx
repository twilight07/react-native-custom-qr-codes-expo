/*

diamond.js

This file exports a function for drawing a diamond outer eye piece for a QRCode

  --Geoff Natin 11/1/18 17:41

*/
import React from "react";
import { Rect, G } from "react-native-svg";

//Returns an SVG Element for a piece of the 'diamond' outerEyeStyle
export const drawDiamondPiece = (x, y, modules, pieceProperties, props) => {
  const length = modules.length;
  const width = props.size;
  const height = props.size;
  const xsize = width / (length + 2 * props.padding);
  const ysize = height / (length + 2 * props.padding);
  const px = x * xsize + props.padding * xsize;
  const py = y * ysize + props.padding * ysize;
  return (
    <G x={px + xsize / 2} y={py + ysize / 2} rotation={45}>
      <Rect key={px + ":" + py} x={-xsize / 2} y={-ysize / 2} width={xsize} height={ysize} fill={props.color} />
    </G>
  );
};
