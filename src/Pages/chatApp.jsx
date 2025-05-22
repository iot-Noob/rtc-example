import React, { useState, useEffect, useRef } from "react";
import { rtcdata } from "../index";

export const chatApp = () => {
  const peerRef = useRef(null);
  const dataChannelRef = useRef(null);
  const receiveChannelRef = useRef(null);

  const [ice, setIce] = useState([]);
  const [offer, setOffer] = useState("");
  const [uspd, setUspd] = useState("");
  const [uice, setUice] = useState("");

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const online = useRef(false);

  useEffect(() => {
    const p1 = new RTCPeerConnection(rtcdata.config);
    peerRef.current = p1;

    p1.onconnectionstatechange = () => {
      const state = p1.connectionState;
      console.log("📡 Connection state:", state);
      if (state === "connected") {
        online.current = true;
        console.log("✅ WebRTC Peer Connected");
      } else if (["disconnected", "failed", "closed"].includes(state)) {
        online.current = false;
        console.log("❌ WebRTC Peer Disconnected or Failed");
      }
    };

    const dc = p1.createDataChannel("chat");
    dataChannelRef.current = dc;

    dc.onopen = () => {
      console.log("Data channel open");
      dc.send("ammi ki taraf se salam");
    };

    dc.onmessage = (e) => {
      console.log("Message received:", e.data);
      setChat((prev) => [...prev, { from: "Peer", text: e.data }]);
    };

    dc.onerror = (e) => console.error("Data channel error:", e);
    dc.onclose = () => console.log("Data channel closed");

    p1.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannelRef.current = receiveChannel;

      receiveChannel.onopen = () => console.log("Received channel open");
      receiveChannel.onmessage = (e) => {
        console.log("Message from peer:", e.data);
        setChat((prev) => [...prev, { from: "Peer", text: e.data }]);
      };
      receiveChannel.onerror = (e) =>
        console.error("Received data channel error:", e);
    };

    p1.onicecandidate = (event) => {
      if (event.candidate) {
        setIce((prev) => [...prev, event.candidate]);
      }
    };

    return () => {
      console.log("Cleaning up");
      peerRef.current?.close();
      dataChannelRef.current?.close();
      receiveChannelRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    const channel = dataChannelRef.current || receiveChannelRef.current;
    if (channel && channel.readyState === "open") {
      channel.send(message);
      setChat((prev) => [...prev, { from: "Me", text: message }]);
      setMessage("");
    } else {
      console.warn("Channel not ready");
    }
  };

  const createOffer = async () => {
    try {
      const offerDesc = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offerDesc);
      setOffer(JSON.stringify(offerDesc));
    } catch (err) {
      console.error("Offer error:", err);
    }
  };

  const createAnswer = async () => {
    if ((!uspd && !uice) || !uspd || !uice) {
      console.error("Error occur create answer no ice or spd provided");
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
      console.error("Answer error:", err);
    }
  };

  const hangup = () => {
    try {
      peerRef.current?.close();
      dataChannelRef.current?.close();
      receiveChannelRef.current?.close();
    } catch (err) {
      console.warn("Error closing peer connection:", err);
    }

    online.current = false;
    console.log("🔌 Disconnected");

    // Optional: reset everything
    setIce([]);
    setOffer("");
    setUspd("");
    setUice("");
    setMessage("");
    setChat([]);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="font-semibold">Enter SDP:</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={uspd}
            onChange={(e) => setUspd(e.target.value)}
            placeholder="Paste SDP offer here"
          />
          <label className="font-semibold">Enter ICE:</label>
          <textarea
            className="textarea textarea-bordered w-full"
            value={uice}
            onChange={(e) => setUice(e.target.value)}
            placeholder="Paste ICE candidate here"
          />
          <div className="flex gap-4 mt-4">
            <button
              className={`btn btn-primary ${
                (!uspd || !uice) && !online.current ? "btn-disabled" : ""
              }`}
              onClick={online.current ? hangup : createAnswer}
              disabled={(!uspd || !uice) && !online.current} // disable attribute for better accessibility
            >
              {online.current ? "Hang UP" : "Make Call"}
            </button>

            <button
              className={`btn btn-secondary  ${
                online.current == true ? "btn-disabled" : ""
              }`}
              onClick={createOffer}
            >
              Create Offer
            </button>
          </div>
          {offer && (
            <>
              <label className="font-semibold">SDP Output:</label>
              <textarea
                className="textarea textarea-bordered w-full"
                readOnly
                value={offer}
              />
            </>
          )}
          {ice.length > 0 && (
            <>
              <label className="font-semibold">ICE Output:</label>
              <textarea
                className="textarea textarea-bordered w-full"
                readOnly
                value={ice.map((c) => c.candidate).join("\n")}
              />
            </>
          )}
        </div>

        {/* Chat UI */}
        <div className="flex flex-col space-y-4">
          <div className="h-64 border overflow-y-auto p-2 bg-white rounded shadow">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`mb-1 ${
                  msg.from === "Me" ? "text-right" : "text-left"
                }`}
              >
                <span className="font-semibold">{msg.from}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              disabled={!online.current}
              className={`input input-bordered flex-1  `}
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className={`btn btn-accent ${
                online.current ? "" : "btn-disabled"
              }`}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
