# WebRTC Peer Connection Demo

This is a simple React-based WebRTC example project demonstrating how to create peer connections, generate offers/answers, and exchange ICE candidates manually. It helps understand the basics of WebRTC without a signaling server.

## 🚀 Features

- Create WebRTC offer using `RTCPeerConnection`
- Manually input SDP and ICE to simulate peer-to-peer connection
- Display generated offer and ICE candidates
- React functional component with hooks (`useState`, `useEffect`)
- Tailwind CSS for UI styling

## 🧰 Technologies Used

- **React**
- **WebRTC API**
- **Tailwind CSS**

---

## 📦 Installation

## **1. Clone the repository:**

```bash
git clone https://github.com/iot-Noob/rtc-example
cd rtc-example
```
## **2. Install dependencies:**
```bash
npm install
```
## **3. Run the development server:**
```bash
npm run dev
```
## **4. 📂 Project Structure**
```pgsql
src/
├── components/
│   └── rtcExample.js       # Main WebRTC logic
├── index.js                # Entry point
└── App.js                  # App wrapper
```

## **🛠️ How It Works**
 ### **✅ Step 1: Create an Offer**
1. Click the "Create Offer" button.
2. The generated SDP offer will appear in the output box.
3. Copy this offer and send it to the remote peer.
### **✅ Step 2: Receive Answer**
1. The remote peer should:
    - Paste the received SDP offer in the input field.
    - Paste one ICE candidate (manually for now).
    - Click "Make Call" to generate an answer.
2. The SDP answer and ICE for the remote peer will be generated similarly.

### **🧪 Testing**
This demo is best tested by opening two browser tabs or windows (ideally in different browsers or incognito), acting as two peers, and manually copying the offer/answer and ICE candidates.
### **⚠️ Limitations**
No signaling server: Manual exchange of data is required.

Only single ICE candidate handling

Basic example: Not production-ready, intended for educational purposes
### **✨ To-Do (Optional Enhancements)**
- Add a signaling server (WebSocket/Socket.IO)
- Support multiple ICE candidates
- Add media stream handling (audio/video)
- Error boundary handling and UX 

### **🧑‍💻 Author**
M Talha Khalid IOT Noob

### **📄 License**
This project is licensed under the MIT License.