import React, { useRef } from 'react';

const WebcamTest = () => {
  const videoRef = useRef();

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = false;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing display media:', err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <button onClick={startSharing} className="bg-blue-500 text-white px-4 py-2 rounded">
        Start Screen Share with Audio
      </button>
      <video ref={videoRef} autoPlay controls playsInline className="w-full h-auto border rounded" />
    </div>
  );
};

export default WebcamTest;
