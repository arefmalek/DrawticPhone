import { useContext, useEffect, useRef } from "react";

import "./CameraCanvas.css";

import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { HandsContext } from "../context/HandsContext";
import {
  fixedQueue,
  paletteAlpha,
  drawLine,
  isOpen, 
  toScreen,
  gesture,
  distance,
  distance2d,
  strokeSize,
  WIDTH, HEIGHT,
  palette
} from "../draw";

export default function CameraCanvas(props) {
  const timer = useRef();

  const hands = useContext(HandsContext);

  const videoRef = useRef();
  const canvasRef = useRef();

  const linesMapRef = useRef(new Map());
  const currentLineRef = useRef([]);
  const xQueueRef = useRef(new fixedQueue(2));
  const yQueueRef = useRef(new fixedQueue(2));

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

        var handColor = palette.seaGreen;
        if (form === "draw") {
          handColor = palette.red;
        }
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: handColor,
          lineWidth: 5,
        });
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

  useEffect(() => {
    const func = async() => {
      try {
        const camera = new Camera(videoRef.current, {
          width: 1280,
          height: 720,
          onFrame: () => {}
        });
        await camera.start();

        const h = await hands;
        h.onResults(onResults);
        timer.current = setInterval(async() => {
          h.send({ image: videoRef.current });
        }, [100])
      } catch (err) {
        alert(err)
      }
    }
    func()

    return () => {
      if (timer?.current)
        clearInterval(timer.current)
    }
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
