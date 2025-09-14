import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/login" className="hover:text-white">Login</Link>
          <Link to="/register" className="hover:text-white">Register</Link>
        </div>
      </div>
    </footer>
  );
}
