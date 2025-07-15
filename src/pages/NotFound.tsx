import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 — Not Found</h1>
      <Link to="/" className="text-blue-500 underline">
        Go Home
      </Link>
    </div>
  )
}
