/*

diamond.js

This file exports a function for drawing a diamond centre piece for a QRCode

  --Geoff Natin 11/1/18 17:41

*/
import React, { Component } from "react";
import { Rect, G } from "react-native-svg";

//Returns an SVG Element for a piece of the 'diamond' codeStyle
export const drawDiamondPiece = (x, y, modules, pieceProperties, props) => {
  var length = modules.length;
  var width = props.size;
  var height = props.size;
  var xsize = width / (length + 2 * props.padding);
  var ysize = height / (length + 2 * props.padding);
  var px = x * xsize + props.padding * xsize;
  var py = y * ysize + props.padding * ysize;
  return (
    <G x={px + xsize / 2} y={py + ysize / 2} rotation={45}>
      <Rect
        key={px + ":" + py}
        x={-xsize / 2}
        y={-ysize / 2}
        width={xsize}
        height={ysize}
        fill={props.color}
      />
    </G>
  );
};
