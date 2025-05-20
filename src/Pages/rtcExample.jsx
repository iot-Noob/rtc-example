import React,{useState,useEffect,useRef} from 'react'
import { rtcdata } from '../index'
export const rtcExample = () => {

const [peer,setPeer]=useState()
const [ice,setIce]=useState([])
const [offer,setOffer]=useState()
const [uspd,setUspd]=useState() 
const [uice,setUice]=useState()
useEffect(() => {
  try {
    const p1 = new RTCPeerConnection(rtcdata.config);
    setPeer(p1 );
    
    p1 .onicecandidate = (event) => {
      
      try {
        if (event.candidate) {
          setIce((prev) => [...prev, event.candidate]);
        }
      } catch (err) {
        console.error("Error handling ICE candidate:", err);
      }
    };

    return () => {
      p1 .close(); // Use the local variable here
    };
  } catch (err) {
    console.error("Error initializing peer connection:", err);
  }
}, []);

 

const createOffer=async()=>{
  if (!peer){
    console.error("Error no peer created")
    return
  }
  try{
     const ofr=await peer.createOffer(
      {
         offerToReceiveAudio: true,
          offerToReceiveVideo: true,
      }
      
     )

     await peer.setLocalDescription(ofr)
     setOffer(JSON.stringify(ofr)); // store as JSON string
 
  }catch (err){
    console.error("Error create offer due to :::",err)
  }
}

const CreateAnswer = async () => {
  try {
    if (!uspd || !uice) {
      console.error("User must enter SDP and ICE");
      return;
    }
 
    // Parse SDP object and set remote description
    let robj = JSON.parse(uspd);
    const remoteDesc = new RTCSessionDescription(robj);
    await peer.setRemoteDescription(remoteDesc);

    // Add ICE candidate as raw string
    const remoteICE = new RTCIceCandidate({
      candidate: uice,
      sdpMid: "0",        // Adjust if you want dynamic input
      sdpMLineIndex: 0
    });
    await peer.addIceCandidate(remoteICE);

    // Create and set local answer
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    

    console.log("Answer created and set:", answer);
    let jsa=JSON.stringify(answer)
    setOffer(jsa)
  } catch (err) {
    console.error("Error creating answer:", err);
  }
};

 
  return (
    <>
<div className="grid grid-cols-2 gap-6 mt-6 p-4">
  {/* Left Side: Input */}
  <div className="flex flex-col space-y-4">
    <label className="font-semibold">Enter SDP:</label>
    <input
      type="text"
      placeholder="Paste SDP offer here"
      className={`input ${uspd?"input-bordered":"input input-error"} w-full`}
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
     <div className="flex flex-row space-x-4 justify-start items-start space-y-4 mt-9">
    <button onClick={CreateAnswer} className="btn btn-primary">
     Make Call
    </button>
        <button onClick={createOffer} className="btn btn-primary">
    Create Offer
    </button>
  </div>
{offer ? (
  <div>
    <label className="font-semibold">SDP Output:</label>
    <textarea
      className="textarea textarea-bordered w-full"
      placeholder="SDP output"
      readOnly
      value={offer || ''}
    ></textarea>
  </div>
) : null}
{ice && ice.length > 0 ? (
  <div>
    <label className="font-semibold">ICE Output:</label>
    <textarea
      className="textarea textarea-bordered w-full"
      placeholder="ICE output"
      readOnly
      value={ice.map((v) => v.candidate).join('\n')}
    ></textarea>
  </div>
) : null}


  </div>

 
 
</div> 


    </>
  )
}
