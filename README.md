# WebRTC Peer Connection Demo

This is a simple React-based WebRTC example project demonstrating how to create peer connections, generate offers/answers, and exchange ICE candidates manually. It helps understand the basics of WebRTC without a signaling server.

## 🚀 Features

- Create WebRTC offer using `RTCPeerConnection`
- Manually input SDP and ICE to simulate peer-to-peer # 📡 WebRTC Peer Connection Demo

A lightweight React-based demo showcasing how to establish a WebRTC peer-to-peer connection **without a signaling server**.

This project is designed for educational purposes and demonstrates how to manually exchange SDP and ICE candidates between two peers using basic UI controls.

---

## 🚀 Features

- Create a WebRTC offer using `RTCPeerConnection`
- Manually input and parse remote SDP and ICE data
- Display and copy the generated offer/answer and ICE candidates
- Fully built using:
  - React functional components
  - React Hooks (`useState`, `useEffect`, `useRef`)
  - Tailwind CSS for styling

---

## 🧰 Tech Stack

- **React**
- **WebRTC API**
- **Tailwind CSS**

---

## 📦 Getting Started

### 1. Clone the Repository

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
 ### **✅ Step 1: Create Offer (Peer A)**
1. Click the "Create Offer" button.
2. The generated SDP offer will appear in the output field.
3. Copy the SDP and ICE values. 
### **✅ Step 2: Make Call (Peer B)**
1. Paste the SDP offer and ICE candidate into the respective input fields.
2. Click ``**"Make Call"**.``
3. This will:
- Set the remote description
- Add the ICE candidate
- Create and send back an SDP answer
## **🔁 Manual Exchange**
- Copy the SDP answer and ICE from Peer B and input it into Peer A manually.
- This simulates a manual signaling process and establishes the WebRTC connection.

### **🧪 Testing**
To test the connection:
- Open the app in two browser tabs, ideally in different browsers or one in Incognito mode.

- Treat each as a separate peer (A and B).

- Manually copy-paste SDP and ICE between tabs.

- Check the browser console logs for successful data channel events and message exchanges.
### **⚠️ Limitations**
- ❌ No signaling server (you must manually exchange SDP/ICE)
- ❌ Only a single ICE candidate is handled at a time
- ❌ No audio/video streaming — only data channels
- ❌ Not intended for production use


### **✨ Future Improvements**
Add signaling via WebSocket or Socket.IO

Handle multiple ICE candidates automatically

Add media stream support (audio/video)

Improve error handling and user feedback

### **🧑‍💻 Author**
M Talha Khalid IOT Noob

### **📄 License**
This project is licensed under the MIT License.