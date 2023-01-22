import "./CameraCanvas.css";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";

import { useEffect, useRef } from "react";

const WIDTH = 640;
const HEIGHT = 360;

const MAX_STROKE_WEIGHT = 10;

// pallette object for colors: one for hand, eraser, fill of circle
const palette = {
  red: "#f07167",
  yellow: "#ffba49",
  seaGreen: "#20a39e",
  yellowGreen: "#9fd356",
  hunterGreen: "#2e5339",
};

const alpha = "7f";
// create another palette with alpha appended
const paletteAlpha = {
  red: palette.red + alpha,
  yellow: palette.yellow + alpha,
  seaGreen: palette.seaGreen + alpha,
  yellowGreen: palette.yellowGreen + alpha,
  hunterGreen: palette.hunterGreen + alpha,
};

class fixedQueue {
  constructor(size) {
    this.size = size;
    this.queue = [];
  }

  push(item) {
    if (this.queue.length >= this.size) {
      this.queue.shift();
    }
    this.queue.push(item);
  }

  get() {
    return this.queue;
  }

  average() {
    let sum = 0;
    for (let i = 0; i < this.queue.length; i++) {
      sum += this.queue[i];
    }
    return sum / this.queue.length;
  }

  clear() {
    this.queue = [];
  }
}

const toScreen = (position) => {
  return {
    x: position.x * WIDTH,
    y: position.y * HEIGHT,
  };
};

// Dot product of vectors a and b
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

// Distance between vectors a and b
const distance = (a, b) => {
  let x = a.x - b.x;
  let y = a.y - b.y;
  let z = a.z - b.z;
  return Math.sqrt(x * x + y * y + z * z);
};

const distance2d = (a, b) => {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
};

// Add two vectors a and b
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

// Subtract vector b from vector a
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

// get cosineTheta of two variables
const cosineTheta = (a, b) =>
  dot(a, b) / (Math.sqrt(dot(a, a)) * Math.sqrt(dot(b, b)));

const magnitude = (vec) =>
  Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

function isOpen(base, pip, dip, tip, wrist) {
  const pipToTip = sub(tip, pip);
  const wristToBase = sub(base, wrist);

  const cosineTheta =
    (dot(wristToBase, pipToTip) / magnitude(pipToTip)) * magnitude(wristToBase);

  if (cosineTheta > 0.0) {
    return true;
  } else if (cosineTheta < 0.0) {
    return false;
  }
}
// determine the gesture of this loop
const gesture = (
  dist,
  distThreshold,
  indexOpen,
  middleOpen,
  ringOpen,
  pinkyOpen
) => {
  // if index open and rest closed, return draw
  if (indexOpen && !middleOpen && !ringOpen && !pinkyOpen) {
    return "draw";
  }
  // else if index and middle open and rest closed, return erase
  else if (indexOpen && middleOpen && ringOpen && !pinkyOpen) {
    return "erase";
  } else {
    return "hover";
  }
  return "hover";
};

const mapRange = (value, min, max, newMin, newMax) => {
  // map and clip
  const valueClipped = Math.min(max, Math.max(min, value));
  const out = ((valueClipped - min) / (max - min)) * (newMax - newMin) + newMin;

  return out;
};

const strokeSize = (thumBase, indexBase, thumbTip) => {
  const baseVec = sub(indexBase, thumBase);
  const tipVec = sub(thumbTip, thumBase);

  const cosT = cosineTheta(baseVec, tipVec);
  const out = mapRange(cosT, 0.5, 1.0, 0.0, MAX_STROKE_WEIGHT);

  return out;
};

export default function CameraCanvas(props) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const linesMapRef = useRef(new Map());
  const currentLineRef = useRef([]);
  const xQueueRef = useRef(new fixedQueue(2));
  const yQueueRef = useRef(new fixedQueue(2));

  useEffect(() => {
    function drawLine(ctx, points, color) {
      if (points.length < 2) return;

      // draw each segment as a seperate line with points[i].weight
      for (let i = 0; i < points.length - 1; i++) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineWidth = points[i].weight;
        ctx.lineTo(points[i + 1].x, points[i + 1].y);
        ctx.stroke();
      }
    }

    function onResults(results) {
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasRef.current.getContext("2d");
      const linesMap = linesMapRef.current;
      const currentLine = currentLineRef.current;
      const xQueue = xQueueRef.current;
      const yQueue = yQueueRef.current;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // loop through all the lines and draw them
      for (const theLine of linesMap.values()) {
        drawLine(canvasCtx, theLine, "#f07167");
      }
      drawLine(canvasCtx, currentLine, "#f07167");
      canvasCtx.restore();

      if (props.downloadRef && props.downloadRef.current.download) {
        const dataUrl = canvasElement.toDataURL();
        // const dataUrl = "your moms house";
        props.downloadRef.current.image = dataUrl;
        // console.log(dataUrl);
        props.theCallback();

        props.downloadRef.current.download = false;
      }

      if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: palette.seaGreen,
            lineWidth: 5,
          });
          // drawLandmarks(canvasCtx, landmarks, {
          //     color: palette.bittersweet,
          //     lineWidth: 2,
          // });

          const wrist = landmarks[0];

          const thumbCmc = landmarks[1];
          const thumbMcp = landmarks[2];
          const thumbIp = landmarks[3];
          const thumbTip = landmarks[4];

          const index = landmarks[5];
          const indexPip = landmarks[6];
          const indexDip = landmarks[7];
          const indexTip = landmarks[8];

          const middle = landmarks[9];
          const middlePip = landmarks[10];
          const middleDip = landmarks[11];
          const middleTip = landmarks[12];

          const ring = landmarks[13];
          const ringPip = landmarks[14];
          const ringDip = landmarks[15];
          const ringTip = landmarks[16];

          const pinky = landmarks[17];
          const pinkyPip = landmarks[18];
          const pinkyDip = landmarks[19];
          const pinkyTip = landmarks[20];

          const baseDist = distance(wrist, index);

          const dist = distance(thumbTip, indexTip) / baseDist;

          const indexOpen = isOpen(index, indexPip, indexDip, indexTip, wrist);
          const middleOpen = isOpen(
            middle,
            middlePip,
            middleDip,
            middleTip,
            wrist
          );
          const ringOpen = isOpen(ring, ringPip, ringDip, ringTip, wrist);
          const pinkyOpen = isOpen(pinky, pinkyPip, pinkyDip, pinkyTip, wrist);

          const form = gesture(
            dist,
            0.75,
            indexOpen,
            middleOpen,
            ringOpen,
            pinkyOpen
          );

          const strokeWeight = strokeSize(thumbCmc, index, thumbTip);

          xQueue.push(indexTip.x * WIDTH);
          yQueue.push(indexTip.y * HEIGHT);

          if (form == "draw") {
            currentLine.push({
              x: xQueue.average(),
              y: yQueue.average(),
              weight: strokeWeight,
            });
          }

          if (form != "draw" && currentLine.length > 0) {
            linesMap.set(currentLine[0], currentLine);
            currentLineRef.current = [];
          }

          const indexTipScreen = toScreen(indexTip);
          const middleTipScreen = toScreen(middleTip);
          const eraseRadius = distance2d(indexTipScreen, middleTipScreen);

          if (form == "erase") {
            // draw a circle around the index finger
            // draw a light yellow circle around the middle finger that's filled in
            // fill in the circle with a light yellow color

            canvasCtx.beginPath();
            canvasCtx.strokeStyle = palette.yellow;
            canvasCtx.lineWidth = 2.5;
            canvasCtx.arc(
              middleTipScreen.x,
              middleTipScreen.y,
              eraseRadius,
              0,
              2 * Math.PI
            );
            canvasCtx.fillStyle = paletteAlpha.yellow;
            canvasCtx.fill();
            canvasCtx.stroke();

            for (const [key, values] of linesMap.entries()) {
              for (const value of values) {
                const eraseDist = distance2d(value, middleTipScreen);
                if (eraseDist < eraseRadius) {
                  linesMap.delete(key);
                  break;
                }
              }
            }
          }
        }
      }
    }

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      selfieMode: true,
    });
    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 1280,
      height: 720,
    });
    camera.start();
  }, []);

  return (
    <div className="container">
      <video ref={videoRef} className="input_video"></video>
      <canvas
        ref={canvasRef}
        className="output_canvas"
        width="640px"
        height="360px"
      ></canvas>
    </div>
  );
}
