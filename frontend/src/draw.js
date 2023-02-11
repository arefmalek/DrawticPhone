export const WIDTH = 640;
export const HEIGHT = 360;

const MAX_STROKE_WEIGHT = 10;

// pallette object for colors: one for hand, eraser, fill of circle
export const palette = {
  red: "#f07167",
  yellow: "#ffba49",
  seaGreen: "#20a39e",
  yellowGreen: "#9fd356",
  hunterGreen: "#2e5339",
};

export const alpha = "7f";
// create another palette with alpha appended
export const paletteAlpha = {
  red: palette.red + alpha,
  yellow: palette.yellow + alpha,
  seaGreen: palette.seaGreen + alpha,
  yellowGreen: palette.yellowGreen + alpha,
  hunterGreen: palette.hunterGreen + alpha,
};

export class fixedQueue {
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

export const toScreen = (position) => {
  return {
    x: position.x * WIDTH,
    y: position.y * HEIGHT,
  };
};

// Dot product of vectors a and b
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

// Distance between vectors a and b
export const distance = (a, b) => {
  let x = a.x - b.x;
  let y = a.y - b.y;
  let z = a.z - b.z;
  return Math.sqrt(x * x + y * y + z * z);
};

export const distance2d = (a, b) => {
  let x = a.x - b.x;
  let y = a.y - b.y;
  return Math.sqrt(x * x + y * y);
};

// Add two vectors a and b
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

// Subtract vector b from vector a
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

// get cosineTheta of two variables
export const cosineTheta = (a, b) =>
  dot(a, b) / (Math.sqrt(dot(a, a)) * Math.sqrt(dot(b, b)));

export const magnitude = (vec) =>
  Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

export function isOpen(base, pip, dip, tip, wrist) {
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
export const gesture = (
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
  if (indexOpen && middleOpen && ringOpen && !pinkyOpen) {
    return "erase";
  }

  return "hover";
};

export const mapRange = (value, min, max, newMin, newMax) => {
  // map and clip
  const valueClipped = Math.min(max, Math.max(min, value));
  const out = ((valueClipped - min) / (max - min)) * (newMax - newMin) + newMin;

  return out;
};

export const strokeSize = (thumBase, indexBase, thumbTip) => {
  const baseVec = sub(indexBase, thumBase);
  const tipVec = sub(thumbTip, thumBase);

  const cosT = cosineTheta(baseVec, tipVec);
  const out = mapRange(cosT, 0.5, 1.0, 0.0, MAX_STROKE_WEIGHT);

  return out;
};

export const drawLine = (ctx, points, color) => {
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