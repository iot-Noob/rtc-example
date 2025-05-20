import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

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

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="flex flex-col items-center space-y-4 bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-8 shadow-lg">
      <div className="loading-spinner loading loading-spinner-lg loading-primary"></div>
      <h2 className="text-white text-xl font-semibold">Loading, please wait...</h2>
    </div>
  </div>
)

export default App
