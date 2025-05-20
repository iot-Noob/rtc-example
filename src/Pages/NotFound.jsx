export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-extrabold text-white mb-6">404</h1>
      <h2 className="text-3xl font-semibold text-white mb-4">Oops! Page Not Found</h2>
      <p className="text-white max-w-md mb-8">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="btn btn-primary btn-lg"
      >
        Go Home
      </button>
    </div>
  );
}
