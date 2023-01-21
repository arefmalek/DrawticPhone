
console.log(document.getElementsByClassName("input_video")[0]);
const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

// Dot product of vectors a and b
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

// Distance between vectors a and b
const distance = (a, b) => {
    let x = a.x - b.x;
    let y = a.y - b.y;
    let z = a.z - b.z;
    return Math.sqrt(x * x + y * y + z * z);
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
        (dot(wristToBase, pipToTip) / magnitude(pipToTip)) *
        magnitude(wristToBase);
    // console.log(cosineTheta);

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
    if (dist < distThreshold) {
        return "pinch";
    } else if (indexOpen && middleOpen && !ringOpen && !pinkyOpen) {
        return "erase";
    } else {
        return "hover";
    }
};

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#CADBC0",
                lineWidth: 5,
            });
            drawLandmarks(canvasCtx, landmarks, {
                color: "#f07167",
                lineWidth: 2,
            });

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

            const dist = distance(thumbTip, indexTip);
            const fingDot = cosineTheta(
                sub(indexTip, indexPip),
                sub(middleTip, middlePip)
            );

            const indexOpen = isOpen(
                index,
                indexPip,
                indexDip,
                indexTip,
                wrist
            );
            const middleOpen = isOpen(
                middle,
                middlePip,
                middleDip,
                middleTip,
                wrist
            );
            const ringOpen = isOpen(ring, ringPip, ringDip, ringTip, wrist);
            const pinkyOpen = isOpen(
                pinky,
                pinkyPip,
                pinkyDip,
                pinkyTip,
                wrist
            );

            //                    console.log("Index finger: " + isOpen(index, indexPip, indexDip, indexTip, wrist));
            //                    console.log("Middle finger: " + isOpen(middle, middlePip, middleDip, middleTip, wrist));
            //                    console.log("Ring finger: " + isOpen(ring, ringPip, ringDip, ringTip, wrist));
            //                    console.log("Pinky finger: " + isOpen(pinky, pinkyPip, pinkyDip, pinkyTip, wrist));

            const form = gesture(
                dist,
                0.15,
                indexOpen,
                middleOpen,
                ringOpen,
                pinkyOpen
            );
            console.log(form);
        }
    }
    canvasCtx.restore();
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

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
});
camera.start();