import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, onLogout }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    onLogout(); // Use the logout handler from App.jsx
    navigate("/");
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Function to get initials from name (first letters of words)
  const getInitials = (name) => {
    console.log("getInitials called with:", name); // Debug log
    if (!name) return "U";
    const words = name.trim().split(/\s+/); // Split by whitespace and remove empty strings
    console.log("Words array:", words); // Debug log
    if (words.length === 1) {
      // If only one word, return first letter
      const result = words[0].charAt(0).toUpperCase();
      console.log("Single word result:", result); // Debug log
      return result;
    } else {
      // If multiple words, return first letter of first two words
      const result = words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
      console.log("Multiple words result:", result); // Debug log
      return result;
    }
  };

  // Function to get background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    if (!name) return 'bg-gray-500';
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Debug log for current user
  console.log("Current user in Navbar:", currentUser);

  // Only show profile if user is logged in and has user data
  if (!isLoggedIn || !currentUser) {
    return (
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-blue-700"
            >
              <svg 
                className="h-6 w-6 sm:h-7 sm:w-7" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>SkillCheck AI</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              <Link to="/" className="hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/login" className="hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-600 font-medium transition-colors">
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* Close icon */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-blue-700"
            onClick={closeMobileMenu}
          >
            <svg 
              className="h-6 w-6 sm:h-7 sm:w-7" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>SkillCheck AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/career-options" className="hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-50 p-1"
              >
                {/* Profile Picture with Initials */}
                <div className={`h-8 w-8 rounded-full ${getAvatarColor(currentUser.name)} flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200`}>
                  {getInitials(currentUser.name)}
                </div>
                <span className="hidden lg:block text-gray-700 font-medium">
                  {currentUser.name}
                </span>
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                  {/* User Profile Section - Column Layout */}
                  <div className="flex flex-col items-center px-6 pb-4 border-b border-gray-100">
                    {/* Profile Picture with Initials */}
                    <div className="mb-4">
                      <div className={`h-20 w-20 rounded-full ${getAvatarColor(currentUser.name)} flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-200`}>
                        {getInitials(currentUser.name)}
                      </div>
                    </div>

                    {/* User Name */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                      {currentUser.name}
                    </h3>

                    {/* User Email */}
                    <p className="text-sm text-gray-500 text-center mb-4">
                      {currentUser.email}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="px-4 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-blue-200 hover:border-blue-300"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="px-4 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200 hover:border-red-300"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {/* Mobile Profile Section - Column Layout */}
            <div className="px-3 py-4 border-b border-gray-200 mb-2">
              <div className="flex flex-col items-center">
                {/* Profile Picture with Initials */}
                <div className="mb-3">
                  <div className={`h-16 w-16 rounded-full ${getAvatarColor(currentUser.name)} flex items-center justify-center text-white text-lg font-bold border-2 border-gray-200`}>
                    {getInitials(currentUser.name)}
                  </div>
                </div>

                {/* User Name */}
                <h3 className="text-base font-semibold text-gray-900 mb-1 text-center">
                  {currentUser.name}
                </h3>

                {/* User Email */}
                <p className="text-sm text-gray-500 text-center">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <Link
              to="/career-options"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}