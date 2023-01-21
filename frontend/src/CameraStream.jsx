import React, { useState, useEffect } from 'react';

function CameraStream() {
  const [stream, setStream] = useState(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error(err);
      }
    }
    enableStream();
  }, []);

  useEffect(() => {
    if (!stream) return;
    const context = canvasRef.current.getContext('2d');
    const video = videoRef.current;
    function drawLine() {
      context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(100, 100);
      context.stroke();
      requestAnimationFrame(drawLine);
    }
    requestAnimationFrame(drawLine);
  }, [stream]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: '100%' }} />
      <video
        ref={videoRef}
        style={{ width: '100%' }}
        autoPlay
        controls={false}
      />
    </div>
  );
}

export default CameraStream;
