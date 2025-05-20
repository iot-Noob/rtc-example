import React, { useState, useEffect, useRef } from 'react';
import { rtcdata } from '../index';

export const rtcExample = () => {
  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const receiveChannelRef = useRef(null);

  const [ice, setIce] = useState([]);
  const [offer, setOffer] = useState('');
  const [uspd, setUspd] = useState('');
  const [uice, setUice] = useState('');

  useEffect(() => {
    const p1 = new RTCPeerConnection(rtcdata.config);
    peerRef.current = p1;

    // Create data channel only if you are the offerer
    const dc = p1.createDataChannel("chat");
    dataChannelRef.current = dc;

    dc.onopen = () => {
      console.log("Data channel open");
      dc.send("ammi ki taraf se salam"); // Use local dc, not React state
    };

    dc.onclose = () => {
      console.log("Data channel closed");
    };

    dc.onerror = (e) => {
      console.error("Data channel error:", e);
    };

    p1.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannelRef.current = receiveChannel;

      receiveChannel.onopen = () => {
        console.log("Received data channel opened");
        receiveChannel.send("test"); 
      };

      receiveChannel.onmessage = (e) => {
        console.log("Message from peer:", e.data);
      };

      receiveChannel.onclose = () => {
        console.log("Received data channel closed");
      };

      receiveChannel.onerror = (e) => {
        console.error("Received data channel error:", e);
      };
    };

    p1.onicecandidate = (event) => {
      if (event.candidate) {
        setIce(prev => [...prev, event.candidate]);
      }
    };

    return () => {
      if (peerRef.current) peerRef.current.close();
      if (dataChannelRef.current) dataChannelRef.current.close();
      if (receiveChannelRef.current) receiveChannelRef.current.close();
    };
  }, []);

  const createOffer = async () => {
    if (!peerRef.current) {
      console.error("No peer connection");
      return;
    }
    try {
      const offerDesc = await peerRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peerRef.current.setLocalDescription(offerDesc);
      setOffer(JSON.stringify(offerDesc));
    } catch (err) {
      console.error("Error creating offer:", err);
    }
  };

  const createAnswer = async () => {
    if (!peerRef.current) {
      console.error("No peer connection");
      return;
    }
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

      if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
        dataChannelRef.current.send("ammi ki taraf se salam");
      }
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-6 mt-6 p-4">
        <div className="flex flex-col space-y-4">
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
          <div className="flex flex-row space-x-4 justify-start items-start mt-9">
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
      </div>
    </>
  );
};
