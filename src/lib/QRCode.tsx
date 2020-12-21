/*

QRCode.js

This is a Customisable QR Code Component for React Native Applications.

  --Geoff Natin 08/7/17 21:49

*/

//-----------------------------Imports-----------------------------------
import React from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import { generateQRCode } from "./QRCodeGenerator";
import { drawPiece } from "./styles";
import Svg, { Rect, Defs, ClipPath, LinearGradient, Stop } from "react-native-svg";

const EyeStyle = {
  square: "square",
  circle: "circle",
  diamond: "diamond",
} as const;
type EyeStyle = typeof EyeStyle[keyof typeof EyeStyle];

const CodeStyle = {
  square: "square",
  circle: "circle",
  diamond: "diamond",
  dot: "dot",
  ninja: "ninja",
  sharp: "sharp",
} as const;
type CodeStyle = typeof CodeStyle[keyof typeof CodeStyle];

const Ecl = {
  L: "L",
  M: "M",
  Q: "Q",
  H: "H",
};
type Ecl = typeof Ecl[keyof typeof Ecl];

type propTypes = {
  content: string;
  size: number;
  padding: number;
  color: string;
  linearGradient: string[];
  gradientDirection: string[];
  backgroundColor: string;
  innerEyeStyle: EyeStyle;
  outerEyeStyle: EyeStyle;
  codeStyle: CodeStyle;
  logo: ImageSourcePropType;
  backgroundImage: ImageSourcePropType;
  logoSize: number;
  ecl: Ecl;
};

//-----------------------------FunctionComponent---------------------------------
export default function QRCode(props: propTypes): JSX.Element {
  //-----------------------Methods-----------------------

  //Returns an array of SVG Elements that represent the pieces of the QR Code
  const getPieces = () => {
    const qr = generateQRCode(props);

    const modules = qr.qrcode.modules;

    const size = props.size;
    const length = modules.length;
    const xsize = size / (length + 2 * props.padding);
    const ysize = size / (length + 2 * props.padding);
    const logoX = props.size / 2 - props.logoSize / 2;
    const logoY = props.size / 2 - props.logoSize / 2;
    const logoSize = props.logoSize;

    const pieces = [];
    const nonPieces = [];

    //Add the SVG element of each piece in the body of the QR Code
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        const module = modules[x][y];
        const px = x * xsize + props.padding * xsize;
        const py = y * ysize + props.padding * ysize;

        //TODO: Add function to compute if pieces overlap with circular logos (more complex. Must see if tl or br is inside the radius from the centre of the circle (pythagoras theorem?))
        const overlapsWithLogo =
          (px > logoX && px < logoX + logoSize && py > logoY && py < logoY + logoSize) || //Piece"s top left is inside the logo area
          (px + xsize > logoX && px + xsize < logoX + logoSize && py + ysize > logoY && py + ysize < logoY + logoSize); //Piece"s bottom right is inside the logo area

        if (!props.logo || (props.logo && !overlapsWithLogo)) {
          if (module) {
            pieces.push(getPiece(x, y, modules));
          } else {
            nonPieces.push(getPiece(x, y, modules));
          }
        }
      }
    }

    if (props.backgroundImage) {
      const { size } = props;
      return (
        <View
          style={{
            backgroundColor: "white",
            margin: props.padding * xsize,
          }}
        >
          <Image
            source={props.backgroundImage}
            style={{
              position: "absolute",
              top: props.padding * ysize,
              left: props.padding * xsize,
              height: props.size - props.padding * 2 * ysize,
              width: props.size - props.padding * 2 * xsize,
            }}
          />
          {displayLogo()}
          <Svg height={size} width={size} color="transparent">
            <Defs>
              <ClipPath id="clip">{nonPieces}</ClipPath>
            </Defs>
            <Rect clipPath="url(#clip)" fill="white" x={0} y={0} height="100%" width="100%" />
          </Svg>
        </View>
      );
    } else if (props.linearGradient) {
      const { size, backgroundColor = "transparent" } = props;
      return (
        <View>
          <Svg height={size} width={size} color={backgroundColor}>
            <Defs>
              <ClipPath id="clip">{pieces}</ClipPath>
              <LinearGradient
                id="grad"
                x1={props.gradientDirection[0]}
                y1={props.gradientDirection[1]}
                x2={props.gradientDirection[2]}
                y2={props.gradientDirection[3]}
              >
                <Stop offset="0" stopColor={props.linearGradient[0]} stopOpacity="1" />
                <Stop offset="1" stopColor={props.linearGradient[1]} stopOpacity="1" />
              </LinearGradient>
            </Defs>
            <Rect clipPath="url(#clip)" x={0} y={0} height="100%" width="100%" fill="url(#grad)" />
          </Svg>
          {displayLogo()}
        </View>
      );
    } else {
      const { size, backgroundColor = "transparent" } = props;
      return (
        <View>
          <Svg height={size} width={size} color={backgroundColor}>
            <Defs>
              <ClipPath id="clip">{pieces}</ClipPath>
            </Defs>
            <Rect clipPath="url(#clip)" x={0} y={0} height="100%" width="100%" fill={props.color} />
          </Svg>
          {displayLogo()}
        </View>
      );
    }
  };

  //Renders the logo on top of the QR Code if there is one
  const displayLogo = (): JSX.Element => {
    const { logo, size, logoSize } = props;

    if (logo) {
      return (
        <Image
          source={logo}
          style={{
            width: logoSize,
            height: logoSize,
            position: "absolute",
            left: size / 2 - logoSize / 2,
            top: size / 2 - logoSize / 2,
          }}
        />
      );
    } else {
      return <View />;
    }
  };

  //Returns an SVG Element that represents the piece of the QR code at modules[x][y]
  const getPiece = (x, y, modules): JSX.Element => {
    // Find out which piece type it is
    const pieceProps = getPieceProperties(x, y, modules);
    return drawPiece(x, y, modules, pieceProps, props);
  };

  // Returns an object with orientation and pieceType representation of the piece type. (See https://github.com/mpaolino/qrlib/tree/master/qrlib/static)
  const getPieceProperties = (x, y, modules): JSX.Element => {
    const mod_matrix: any = {};
    mod_matrix.topLeft = x != 0 && y != 0 && modules[x - 1][y - 1];
    mod_matrix.top = y != 0 && modules[x][y - 1];
    mod_matrix.topRight = x != modules.length - 1 && y != 0 && modules[x + 1][y - 1];
    mod_matrix.left = x != 0 && modules[x - 1][y];
    mod_matrix.right = x != modules.length - 1 && modules[x + 1][y];
    mod_matrix.bottomLeft = x != 0 && y != modules.length - 1 && modules[x - 1][y + 1];
    mod_matrix.bottom = y != modules.length - 1 && modules[x][y + 1];
    mod_matrix.bottomRight = x != modules.length - 1 && y != modules.length - 1 && modules[x + 1][y + 1];

    //  (surroundingCount holds the number of pieces above or to the side of this piece)
    let surroundingCount = 0;
    if (mod_matrix.top) {
      surroundingCount++;
    }
    if (mod_matrix.left) {
      surroundingCount++;
    }
    if (mod_matrix.right) {
      surroundingCount++;
    }
    if (mod_matrix.bottom) {
      surroundingCount++;
    }

    const pieceProperties: any = {};
    //Determine what the piece properties are from its surrounding pieces.
    //  (surroundingCount holds the number of pieces above or to the side of this piece)
    //  (See https://github.com/mpaolino/qrlib/tree/master/qrlib/static)
    switch (surroundingCount) {
      case 0: {
        let orientation = 0;
        pieceProperties.pieceType = "1a";
        if (mod_matrix.right) {
          orientation = 90;
        } else if (mod_matrix.bottom) {
          orientation = 180;
        } else if (mod_matrix.left) {
          orientation = 270;
        }
        pieceProperties.orientation = orientation;
        return pieceProperties;
      }
      case 1:
        pieceProperties.pieceType = "2b";
        pieceProperties.orientation = 0;
        return pieceProperties;
      case 2:
        if ((mod_matrix.top && mod_matrix.bottom) || (mod_matrix.left && mod_matrix.right)) {
          const orientation = mod_matrix.top && mod_matrix.bottom ? 0 : 90;
          pieceProperties.pieceType = "1b3b";
          pieceProperties.orientation = orientation;
          return pieceProperties;
        } else {
          if (mod_matrix.top && mod_matrix.right) {
            pieceProperties.orientation = 90;
            pieceProperties.pieceType = mod_matrix.topRight ? "2a1b1a" : "2a1b";
            return pieceProperties;
          } else if (mod_matrix.right && mod_matrix.bottom) {
            pieceProperties.orientation = 180;
            pieceProperties.pieceType = mod_matrix.bottomRight ? "2a1b1a" : "2a1b";
            return pieceProperties;
          } else if (mod_matrix.left && mod_matrix.bottom) {
            pieceProperties.orientation = 270;
            pieceProperties.pieceType = mod_matrix.bottomLeft ? "2a1b1a" : "2a1b";
            return pieceProperties;
          } else {
            pieceProperties.pieceType = mod_matrix.topLeft ? "2a1b1a" : "2a1b";
            return pieceProperties;
          }
        }
      case 3: {
        let orientation = 0;
        pieceProperties.pieceType = "2a1b2c";
        if (mod_matrix.top && mod_matrix.right && mod_matrix.bottom) {
          orientation = 90;
        } else if (mod_matrix.right && mod_matrix.bottom && mod_matrix.left) {
          orientation = 180;
        } else if (mod_matrix.bottom && mod_matrix.left && mod_matrix.top) {
          orientation = 270;
        }
        pieceProperties.orientation = orientation;
        return pieceProperties;
      }
      case 4:
        pieceProperties.pieceType = "2a1b2c3b";
        pieceProperties.orientation = 0;
        return pieceProperties;
    }
  };

  //---------------------Rendering-----------------------
  return getPieces();
}

//-----------------------DefaultProperties---------------------
QRCode.defaultProps = {
  content: "No Content",
  size: 250,
  padding: 1,
  color: "black",
  gradientDirection: [0, 0, 170, 0],
  backgroundColor: "white",
  codeStyle: "square",
  outerEyeStyle: "square",
  innerEyeStyle: "square",
  logoSize: 100,
  ecl: "H",
};
