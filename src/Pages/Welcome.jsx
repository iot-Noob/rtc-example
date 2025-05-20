// Assuming you’re using React (or similar) with Tailwind + DaisyUI installed

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-400 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700">Welcome to WebRTC Connect</h1>
        <p className="mb-8 text-gray-700 text-lg">
          Real-time video and audio calls made easy. Get started by creating or joining a call.
        </p>

        <div className="flex justify-center space-x-4">
          <button className="btn btn-primary btn-lg">
            Start Call
          </button>
          <button className="btn btn-outline btn-lg">
            Join Call
          </button>
        </div>
      </div>
    </div>
  )
}
