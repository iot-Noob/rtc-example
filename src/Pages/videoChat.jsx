import React, { useState, useEffect, useRef } from 'react';
import { rtcdata } from '../index';

export const videoChat = () => {
  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const receiveChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [ice, setIce] = useState([]);
  const [offer, setOffer] = useState('');
  const [uspd, setUspd] = useState('');
  const [uice, setUice] = useState('');

  useEffect(() => {
    const init = async () => {
      const p1 = new RTCPeerConnection(rtcdata.config);
      peerRef.current = p1;

      // Get local media stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach(track => p1.addTrack(track, stream));
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }

      // Handle remote tracks
      p1.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      p1.onicecandidate = (event) => {
        if (event.candidate) {
          setIce(prev => [...prev, event.candidate]);
        }
      };

      // Create data channel (optional)
      const dc = p1.createDataChannel("chat");
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log("Data channel open");
        dc.send("ammi ki taraf se salam");
      };

      dc.onclose = () => console.log("Data channel closed");
      dc.onmessage = (e) => console.log("Message received:", e.data);
      dc.onerror = (e) => console.error("Data channel error:", e);

      p1.ondatachannel = (event) => {
        const receiveChannel = event.channel;
        receiveChannelRef.current = receiveChannel;

        receiveChannel.onopen = () => {
          console.log("Received data channel opened");
          receiveChannel.send("test");
        };
        receiveChannel.onmessage = (e) => console.log("Message from peer:", e.data);
        receiveChannel.onclose = () => console.log("Received data channel closed");
        receiveChannel.onerror = (e) => console.error("Received data channel error:", e);
      };
    };

    init();

    return () => {
      console.log("Cleaning up");
      peerRef.current?.close();
      dataChannelRef.current?.close();
      receiveChannelRef.current?.close();
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const createOffer = async () => {
    try {
      const offerDesc = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offerDesc);
      setOffer(JSON.stringify(offerDesc));
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const createAnswer = async () => {
    if (!uspd || !uice) {
      console.error("Must enter SDP and ICE");
      return;
    }

    try {
      const remoteDesc = new RTCSessionDescription(JSON.parse(uspd));
      await peerRef.current.setRemoteDescription(remoteDesc);

      const iceCandidate = new RTCIceCandidate({
        candidate: uice,
        sdpMid: "0",
        sdpMLineIndex: 0,
      });
      await peerRef.current.addIceCandidate(iceCandidate);

      const answerDesc = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answerDesc);
      setOffer(JSON.stringify(answerDesc));
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 mt-6 p-4">
        <div className="space-y-4">
          <video ref={localVideoRef} autoPlay muted className="w-full border rounded" />
          <label className="block text-center font-semibold">Local Video</label>
        </div>
        <div className="space-y-4">
          <video ref={remoteVideoRef} autoPlay className="w-full border rounded" />
          <label className="block text-center font-semibold">Remote Video</label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 p-4">
        <label className="font-semibold">Enter SDP:</label>
        <input
          type="text"
          placeholder="Paste SDP offer here"
          className={`input ${uspd ? "input-bordered" : "input input-error"} w-full`}
          value={uspd}
          onChange={(e) => setUspd(e.target.value)}
        />
        <label className="font-semibold">Enter ICE:</label>
        <input
          type="text"
          placeholder="Paste ICE candidate here"
          className="input input-bordered w-full"
          value={uice}
          onChange={(e) => setUice(e.target.value)}
        />
        <div className="flex flex-row space-x-4 justify-start mt-4">
          <button onClick={createAnswer} className="btn btn-primary">
            Make Call
          </button>
          <button onClick={createOffer} className="btn btn-primary">
            Create Offer
          </button>
        </div>
        {offer && (
          <div>
            <label className="font-semibold">SDP Output:</label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="SDP output"
              readOnly
              value={offer}
            />
          </div>
        )}
        {ice.length > 0 && (
          <div>
            <label className="font-semibold">ICE Output:</label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="ICE output"
              readOnly
              value={ice.map((v) => v.candidate).join("\n")}
            />
          </div>
        )}
      </div>
    </>
  );
};
