import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceRecorder from "./VoiceRecorder";

export default function Interview({ title, questions, expectedAnswers }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stopSignal, setStopSignal] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // Initialize answers and current question on mount only
  useEffect(() => {
    if (questions.length > 0) {
      // Check if we have saved progress for this specific interview
      const savedProgress = localStorage.getItem(`interview_${title}_progress`);
      if (savedProgress) {
        try {
          const { currentQ: savedQ, answers: savedAnswers, timestamp } = JSON.parse(savedProgress);
          // Only restore if progress is less than 1 hour old
          if (savedAnswers && savedAnswers.length === questions.length && 
              timestamp && (Date.now() - timestamp) < 3600000) {
            setCurrentQ(savedQ || 0);
            setAnswers(savedAnswers);
            return;
          }
        } catch (e) {
          console.warn('Invalid saved progress, starting fresh');
        }
      }
      // No saved progress or expired, start fresh
      setAnswers(Array(questions.length).fill(""));
      setCurrentQ(0);
    }
  }, [questions.length, title]);

  // Save progress including current question
  useEffect(() => {
    if (questions.length > 0) {
      const progress = {
        currentQ,
        answers,
        timestamp: Date.now()
      };
      localStorage.setItem(`interview_${title}_progress`, JSON.stringify(progress));
    }
  }, [answers, currentQ, questions.length, title]);

  // Auto-redirect after 5s if warning is shown
  useEffect(() => {
    let timer;
    if (showWarning && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    if (showWarning && countdown === 0) {
      navigate("/summary", { state: { questions, answers, expectedAnswers } });
    }
    return () => clearTimeout(timer);
  }, [showWarning, countdown, navigate, questions, answers, expectedAnswers]);

  // 🎥 Start camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((err) => {
            console.error("Video play failed:", err);
          });
        };
      }

      const [videoTrack] = stream.getVideoTracks();
      videoTrack.onended = () => {
        console.warn("Camera stopped! Showing warning...");
        setShowWarning(true);
        setCountdown(5);
      };

      setIsCameraOn(true);
      setIsMuted(false);
    } catch (err) {
      console.error("Camera error:", err.name, err.message);
      setShowWarning(true);
      setCountdown(5);
    }
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // 🎥 Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setShowWarning(true);
    setCountdown(5);
  };

  // 🎤 Mute/unmute
  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  // 👉 Next question
  const nextQuestion = () => {
    setStopSignal((s) => s + 1);

    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // Clear progress when finishing interview
      localStorage.removeItem(`interview_${title}_progress`);
      navigate("/summary", {
        state: { questions, answers, expectedAnswers, category: title },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        {title}
      </h1>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">⚠ Camera Stopped</h2>
            <p className="text-gray-700 mb-4">
              Your camera has been turned off. The interview will now end.
            </p>
            <p className="text-gray-600 mb-6">
              Redirecting to summary in{" "}
              <span className="font-bold">{countdown}</span> seconds...
            </p>
            <button
              onClick={() =>
                navigate("/summary", {
                  state: { questions, answers, expectedAnswers },
                })
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              OK, Go to Summary Now
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Camera */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Camera Preview
            </h3>
            <div className="flex justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-w-md h-64 bg-black rounded-xl shadow"
              ></video>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-4">Camera Controls</h3>
            <div className="flex justify-center gap-6 mb-4">
              <button
                onClick={isCameraOn ? stopCamera : startCamera}
                className={`p-4 rounded-full shadow ${
                  isCameraOn ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {isCameraOn ? <CameraOff /> : <Camera />}
              </button>
              {isCameraOn && (
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full shadow ${
                    isMuted ? "bg-gray-500 text-white" : "bg-yellow-500 text-white"
                  }`}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </button>
              )}
            </div>

            {/* ⚠️ Note under camera controls */}
            <p className="text-sm text-red-600 font-semibold">
              ⚠ Don’t stop camera — if it stops, the interview ends!
            </p>
          </div>
        </div>

        {/* Right Side - Question */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-4">
            Question {currentQ + 1} of {questions.length}
          </h3>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            {questions[currentQ]}
          </p>

          <div className="mb-6">
            <VoiceRecorder
              stopSignal={stopSignal}
              onTranscribed={(text) => {
                const updated = [...answers];
                updated[currentQ] = text;
                setAnswers(updated);
              }}
            />
          </div>

          <textarea
            value={answers[currentQ] || ""}
            onChange={(e) => {
              const updated = [...answers];
              updated[currentQ] = e.target.value;
              setAnswers(updated);
            }}
            className="w-full border rounded p-3 focus:outline-blue-500 mb-6"
            rows="6"
            placeholder="Your answer will appear here..."
          ></textarea>

          <div className="flex justify-center">
            <button
              onClick={nextQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {currentQ < questions.length - 1 ? "Next Question" : "Finish Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
