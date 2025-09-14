import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Summary from "./pages/Summary";
import Interview from "./Interview";

// Clerk publishable key (from your .env file)
const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_d2hvbGUtbW90aC03MC5jbGVyay5hY2NvdW50cy5kZXYk";

function AppContent() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // HR Interview
  const hrQuestions = [
    "Tell me about yourself.",
    "Why do you want to join our company?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging situation and how you handled it.",
  ];
  const hrExpectedAnswers = [
    "Introduce yourself briefly and professionally",
    "Explain your motivation to join the company",
    "List your strengths and weaknesses honestly",
    "Talk about your 5-year plan",
    "Describe a challenging situation and your solution",
  ];

  // Mock Interview
  const mockQuestions = [
    "What motivates you to work hard?",
    "How do you handle stress and pressure?",
    "Explain a time you worked in a team.",
    "What's your biggest professional achievement?",
    "Why should we hire you?",
  ];
  const mockExpectedAnswers = [
    "Discuss what motivates you",
    "Explain how you manage stress",
    "Give an example of teamwork",
    "Highlight your professional achievement",
    "Explain why you are the best fit",
  ];

  // Technical Interview
  const technicalQuestions = [
    "Explain OOP principles with examples.",
    "What is the difference between HTTP and HTTPS?",
    "How do you optimize a slow SQL query?",
    "What is the time complexity of binary search?",
    "Explain how React's useState works internally.",
  ];
  const technicalExpectedAnswers = [
    "Explain OOP concepts like inheritance, polymorphism, encapsulation, abstraction",
    "Describe HTTP vs HTTPS",
    "Explain SQL query optimization techniques",
    "State binary search time complexity",
    "Explain React's useState internal working",
  ];

  return (
    <Router>
      <Navbar
        isLoggedIn={isSignedIn}
        setIsLoggedIn={() => {}} // Not needed with Clerk
        currentUser={
          isSignedIn && user
            ? {
                name:
                  user.fullName ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.emailAddresses[0]?.emailAddress ||
                  "User",
                email: user.emailAddresses[0]?.emailAddress || "",
                avatar: user.imageUrl,
                id: user.id,
              }
            : null
        }
        setCurrentUser={() => {}} // Not needed with Clerk
        onLogout={handleLogout}
      />

      <Routes>
        <Route path="/" element={<Project />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />

        {/* ✅ Fix Clerk callback route */}
        <Route
          path="/register/sso-callback"
          element={<Navigate to="/login" replace />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* HR Interview */}
        <Route
          path="/hr-interview"
          element={
            <Interview
              title="HR Interview"
              color="blue"
              questions={hrQuestions}
              expectedAnswers={hrExpectedAnswers}
            />
          }
        />

        {/* Mock Interview */}
        <Route
          path="/mock-interview"
          element={
            <Interview
              title="Mock Interview"
              color="green"
              questions={mockQuestions}
              expectedAnswers={mockExpectedAnswers}
            />
          }
        />

        {/* Technical Interview */}
        <Route
          path="/technical-interview"
          element={
            <Interview
              title="Technical Interview"
              color="purple"
              questions={technicalQuestions}
              expectedAnswers={technicalExpectedAnswers}
            />
          }
        />

        {/* Summary Page */}
        <Route path="/summary" element={<Summary />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AppContent />
    </ClerkProvider>
  );
}
