# WebRTC Peer Connection Demo
This is a simple React-based WebRTC example project demonstrating how to create peer connections, generate offers/answers, and exchange ICE candidates manually. It helps understand the basics of WebRTC without a signaling server.

---

## 🚀 Features

- Create a WebRTC offer using `RTCPeerConnection`
- Manually input and parse remote SDP and ICE data to simulate peer-to-peer communication
- Display and copy the generated offer/answer and ICE candidates
- Basic data channel for messaging (chat)
- Video streaming support for peer-to-peer video calls
- Fully built using:
  - React functional components
  - React Hooks (`useState`, `useEffect`, `useRef`)
  - Tailwind CSS for styling
---

## 🚀 Features

- Create a WebRTC offer using `RTCPeerConnection`
- Manually input and parse remote SDP and ICE data to simulate peer-to-peer communication
- Display and copy the generated offer/answer and ICE candidates
- Basic data channel for messaging (chat)
- Video streaming support for peer-to-peer video calls
- Fully built using:
  - React functional components
  - React Hooks (`useState`, `useEffect`, `useRef`)
  - Tailwind CSS for styling


---

## 🧰 Tech Stack

- **React**
- **React Router v6** for client-side routing
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
├── routes/
│   └── SlicerIndex.js      # Nested WebRTC routes handler
├── Pages/
│   ├── Welcome.js          # Welcome landing page
│   ├── NotFound.js         # 404 page
│   └── ...                 # Other feature pages
├── index.js                # Entry point
└── App.js                  # App wrapper with routing
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

## 📚 Routing and Application Structure

This project uses **React Router v6** for client-side routing with lazy loading and nested routes to improve performance and modularity.

### Main Routes in `App.js`

The app uses `React.lazy` and `Suspense` to load pages/components asynchronously.

Routes defined:

- `/` → Loads the **Welcome** page lazily.
- `/webrtc/*` → Loads the **SlicerIndex** component, which handles all sub-routes under `/webrtc`.
- `*` (catch-all) → Loads the **NotFound** page for undefined routes.

### Code Example (simplified):

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const Welcome = lazy(() => import('./Pages/Welcome'))
const NotFound = lazy(() => import('./Pages/NotFound'))
import { SlicerIndex } from './routes/SlicerIndex'

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/webrtc/*" element={<SlicerIndex />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
```
### **About** SlicerIndex
* SlicerIndex is a nested router component that manages all WebRTC-related routes under /webrtc.
* This allows grouping of WebRTC demo features (/webrtc/rtc, /webrtc/chat, /webrtc/video, etc.) under one parent path.
### **🎨 Loading Screen**
While lazily loaded components are fetched, a loading spinner and message display via the `Suspense` fallback component `LoadingScreen`:
```jsx
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 shadow-lg">
      <div className="loading-spinner loading loading-spinner-lg loading-primary"></div>
      <h2 className="text-white text-xl font-semibold">Loading, please wait...</h2>
    </div>
  </div>
)
```
### **🧭 How to Navigate**
- Visit / for the Welcome page.
- Visit /webrtc to access the main WebRTC demo features via nested routing.
- Unknown routes show the 404 Not Found page.
### **🧑‍💻 Author**
M Talha Khalid IOT Noob

### **📄 License**
This project is licensed under the MIT License.