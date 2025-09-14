import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
}
