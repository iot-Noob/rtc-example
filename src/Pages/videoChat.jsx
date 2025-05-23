import { React, useState, useEffect, useRef } from "react";
import { rtcdata } from "../index";
const videoChat = () => {
  let peerRef = useRef();
  let online = useRef(false);
  const [ice, setIce] = useState([]);
  const [offer, setOffer] = useState();
  const [usdp, Suspd] = useState();
  const [uice, Suice] = useState();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [cameraOn, setCameraOn] = useState(false);

  const camera_switch = async () => {
    if (cameraOn) {
      const stream = localVideoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }
      setCameraOn(false);
      console.log("Camera turned OFF");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 🚀 Add to WebRTC connection
        stream.getTracks().forEach((track) => {
          peerRef.current.addTrack(track, stream);
        });

        setCameraOn(true);
        console.log("Camera turned ON");
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    }
  };

  useEffect(() => {
    const peer = new RTCPeerConnection(rtcdata.config);
    peerRef.current = peer;

    peer.onconnectionstatechange = () => {
      const state = peer.connectionState;
      console.log("📡 Connection state:", state);
      if (state === "connected") {
        online.current = true;
        console.log("✅ WebRTC Peer Connected");
      } else if (["disconnected", "failed", "closed"].includes(state)) {
        online.current = false;
        console.log("❌ WebRTC Peer Disconnected or Failed");
      }
    };

    peerRef.current.ontrack = (event) => {
      const stream = event.streams[0];
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;

      event.track.onended = () => {
        console.log("Remote track ended");
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      };

      event.track.onmute = () => {
        console.log("Remote track muted");
        // Optionally: you can check if all video tracks are muted or ended, then clear video:
        const videoTracks = stream.getVideoTracks();
        const allMutedOrEnded = videoTracks.every(
          (t) => t.muted || t.readyState === "ended" || !t.enabled
        );
        if (allMutedOrEnded && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = null;
        }
      };

      event.track.onunmute = () => {
        console.log("Remote track unmuted");
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
      };
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        setIce((prev) => [...prev, event.candidate]);
      }
    };
  }, []);
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
    if (!peerRef.current) {
      console.error("No peer connection");
      return;
    }
    if (!usdp || !uice) {
      console.error("Must enter SDP and ICE");
      return;
    }

    try {
      const remoteDesc = new RTCSessionDescription(JSON.parse(usdp));
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

      // if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      //   dataChannelRef.current.send("ammi ki taraf se salam");
      // }
    } catch (err) {
      console.error("Error creating answer:", err);
    }
  };
  const hangup = () => {
    try {
      // Close peer connection
      if (peerRef.current) {
        peerRef.current.close();
        peerRef.current = null;
      }

      // Stop local stream tracks
      const localStream = localVideoRef.current?.srcObject;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      // Clear video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }

      // Reset state
      online.current = false;
      setCameraOn(false);
      setIce([]);
      setOffer("");
      Suspd("");
      Suice("");

      console.log("🔌 Disconnected and cleaned up");
    } catch (err) {
      console.warn("Error during hangup:", err);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Left: P2P Chat Interface */}
        <div className="p-6 space-y-6 border-r border-gray-300">
          <h2 className="text-2xl font-bold text-center mb-4">P2P Call</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Video streams */}
            <div className="flex flex-col items-center space-y-2">
              <video
                ref={localVideoRef}
                id="localVideo"
                autoPlay
                controls={false}
                playsInline
                className="w-full rounded-lg border border-gray-300 shadow-sm"
              />

              <span className="text-sm text-gray-600">Local Stream</span>
              <button onClick={camera_switch} className="btn btn-secondary">
                {" "}
                {cameraOn ? "Camera Off" : "Camera On"}
              </button>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <video
                ref={remoteVideoRef}
                id="remoteVideo"
                autoPlay
                controls={false}
                playsInline
                className="w-full rounded-lg border border-gray-300 shadow-sm"
              />
              <span className="text-sm text-gray-600">Remote Stream</span>
            </div>
          </div>

          {/* Input boxes */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="sdpInput"
                className="block text-sm font-medium mb-1"
              >
                Enter SDP
              </label>
              <textarea
                id="sdpInput"
                value={usdp}
                onChange={(e) => Suspd(e.target.value)}
                rows={4}
                className={`textarea textarea-bordered w-full ${
                  usdp ? "input" : "input-error"
                }`}
                placeholder="Paste SDP here"
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="iceInput"
                className="block text-sm font-medium mb-1"
              >
                Enter ICE Candidate
              </label>
              <input
                value={uice}
                onChange={(e) => {
                  Suice(e.target.value);
                }}
                id="iceInput"
                type="text"
                className={`input input-bordered w-full ${
                  uice ? "input" : "input-error"
                }`}
                placeholder="Paste ICE Candidate here"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            <button
              disabled={
                !cameraOn ||
                (!online.current && (usdp || uice)) ||
                online.current
              }
              onClick={createOffer}
              className="btn btn-primary"
            >
              Generate Request
            </button>
            <button
              onClick={online.current ? hangup : createAnswer}
              disabled={!online.current && (!usdp || !uice)}
              className="btn btn-secondary"
            >
              {online.current ? "Hang Up" : "Accept Call"}
            </button>
          </div>
        </div>

        {/* Right: Table */}
        <div className="p-6 overflow-auto">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Generated Request
          </h3>

          {/* Textareas */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">SPD</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-none"
              rows={6}
              readOnly
              value={offer}
            />
            <label className="block mb-1 font-medium text-gray-700">
              ICE Candidates
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded resize-none"
              rows={6}
              readOnly
              value={ice
                .map(
                  (cand, ind) => ind + ":)  " + JSON.stringify(cand.candidate)
                )
                .join("\n")}
            />

            {/* ICE Candidates Table */}
            <table className="table w-full table-zebra mt-4 w-[11px]">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Foundation</th>
                  <th>Type</th>
                  <th>Protocol</th>
                  <th>Address</th>
                  <th>Port</th>
                </tr>
              </thead>
              <tbody>
                {ice?.map((cand, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{cand?.foundation}</td>
                    <td>{cand?.type}</td>
                    <td>{cand?.protocol}</td>
                    <td>{cand?.address}</td>
                    <td>{cand?.port}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table comes below this */}
          {/* ... your table code ... */}
        </div>
      </div>
    </>
  );
};

export default videoChat;
