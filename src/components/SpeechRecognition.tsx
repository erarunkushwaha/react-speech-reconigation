/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import Header from "./Header";
import BrowserSupport from "./BrowserSupport";
import Transcript from "./Transcript";
import Microphone from "./Microphone";
import MicrophoneControlButtons from "./MicrophoneControlButtons";

export interface TranscriptLine {
  id: number;
  text: string;
  timestamp: Date;
}

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentText, setCurrentText] = useState("");
  const recognitionRef = useRef<any>(null);
  const lineIdRef = useRef(0);

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => [
            ...prev,
            {
              id: lineIdRef.current++,
              text: finalTranscript.trim(),
              timestamp: new Date(),
            },
          ]);
          setCurrentText("");
        } else {
          setCurrentText(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setIsMuted(false);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (isListening) {
      if (isMuted) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
    setIsMuted(!isMuted);
  };

  const resetTranscript = () => {
    setTranscript([]);
    setCurrentText("");
    lineIdRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Header />

        {/* Microphone Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Microphone Button */}
          <Microphone
            isListening={isListening}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
          {/* Control Buttons */}
          <MicrophoneControlButtons
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            onReset={resetTranscript}
          />
        </div>

        {/* Transcript Section */}
        <Transcript transcript={transcript} currentText={currentText} />

        {/* Browser Support Notice */}
        {!(
          "webkitSpeechRecognition" in window || "SpeechRecognition" in window
        ) && <BrowserSupport />}
      </div>
    </div>
  );
};

export default SpeechRecognition;
