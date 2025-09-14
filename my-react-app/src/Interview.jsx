import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VoiceRecorder from "./VoiceRecorder";

export default function Interview({ title, questions }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [stopSignal, setStopSignal] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  // 🆕 Reset answers when starting a new interview
  useEffect(() => {
    setAnswers(Array(questions.length).fill("")); // clear all textareas
    setCurrentQ(0);
    localStorage.removeItem("answers"); // optional: clear old stored answers
  }, [questions, title]);

  // Save answers in localStorage (only while in same session)
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

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

      setIsCameraOn(true);
      setIsMuted(false);
    } catch (err) {
      console.error("Camera error:", err.name, err.message);
    }
  };

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
  };

  // 🎤 Mute/unmute audio
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
    // 🛑 stop mic before moving on
    setStopSignal((s) => s + 1);

    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      navigate("/summary", {
        state: { questions, answers },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        {title}
      </h1>

      {/* Camera Preview */}
      <div className="flex justify-center mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-80 h-60 bg-black rounded-xl shadow"
        ></video>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-6 mb-8">
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

      {/* Question */}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold text-lg mb-4">
          Question {currentQ + 1} of {questions.length}
        </h3>
        <p className="text-gray-700 mb-4">{questions[currentQ]}</p>

        {/* VoiceRecorder */}
        <VoiceRecorder
          stopSignal={stopSignal}
          onTranscribed={(text) => {
            const updated = [...answers];
            updated[currentQ] = text;
            setAnswers(updated);
          }}
        />

        {/* Answer box */}
        <textarea
          value={answers[currentQ] || ""}
          onChange={(e) => {
            const updated = [...answers];
            updated[currentQ] = e.target.value;
            setAnswers(updated);
          }}
          className="w-full border rounded p-3 focus:outline-blue-500 mt-4"
          rows="4"
          placeholder="Your answer will appear here..."
        ></textarea>

        <button
          onClick={nextQuestion}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {currentQ < questions.length - 1 ? "Next Question" : "Finish"}
        </button>
      </div>
    </div>
  );
}