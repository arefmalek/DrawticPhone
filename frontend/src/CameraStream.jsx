import React, { useState, useEffect, useRef } from 'react';

function CameraStream() {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(0);

  useEffect(() => {
    async function enableStream() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.classList.toggle('selfie', true);
        videoRef.current.onloadedmetadata = () => {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
      
      } catch (err) {
        console.error(err);
      }

      
    }
    enableStream();
  }, []);

  useEffect(() => {
    if (!stream) return;
    const ctx = canvasRef.current.getContext('2d');

    // draw loop to draw shapes
    function draw() {
      const video = videoRef.current;
      ctx.clearRect(0,0, video.clientHeight, video.clientWidth);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(100, 100);
      ctx.stroke();
      ctx.fillRect(0, 0, 20, 20);


      animationRef.current = requestAnimationFrame(draw);
    }
    draw();

    // cancel animation frame once we remove component from screen
    return () => {
        window.cancelAnimationFrame(animationRef.current);
    }
  }, [stream]);

  return (
    <div style={{ position: "relative"}}>
      <video
        ref={videoRef}
       style={{ height: '100%', width: '100%', transform: 'rotateY(180deg)' }}
        autoPlay
        controls={false}
      />
      <canvas 
        ref={canvasRef} 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1
        }} 
      />
    </div>
  );
}

export default CameraStream;
