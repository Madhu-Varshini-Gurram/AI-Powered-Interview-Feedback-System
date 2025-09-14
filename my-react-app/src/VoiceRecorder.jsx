import { useState, useRef, useEffect } from "react";

export default function VoiceRecorder({ onTranscribed, stopSignal }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition!");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      onTranscribed?.(transcript.trim());
    };

    recognitionRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  // 🛑 Auto-stop when stopSignal changes
  useEffect(() => {
    if (stopSignal && recording) {
      stopRecording();
    }
  }, [stopSignal]);

  return (
    <div className="flex justify-center gap-4">
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          🎤 Start Speaking
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
          🛑 Stop
        </button>
      )}
    </div>
  );
}