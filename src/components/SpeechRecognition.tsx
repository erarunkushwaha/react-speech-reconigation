/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * React imports
 */
import { useState, useRef, useEffect } from "react";

/**
 * Local component imports for UI
 */
import Header from "./Header";
import BrowserSupport from "./BrowserSupport";
import Transcript from "./Transcript";
import Microphone from "./Microphone";
import MicrophoneControlButtons from "./MicrophoneControlButtons";

/**
 * TranscriptLine interface for each transcript line
 * - id: unique line ID
 * - text: recognized text
 * - timestamp: when the text was captured
 */
export interface TranscriptLine {
  id: number;
  text: string;
  timestamp: Date;
}

/**
 * Main SpeechRecognition component
 */
const SpeechRecognition = () => {
  /**
   * State to track if the microphone is listening
   */
  const [isListening, setIsListening] = useState(false);

  /**
   * State to track if the microphone is muted
   */
  const [isMuted, setIsMuted] = useState(false);

  /**
   * Stores all finalized transcript lines
   */
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);

  /**
   * Stores current interim text while user is speaking
   */
  const [currentText, setCurrentText] = useState("");

  /**
   * Ref to hold the SpeechRecognition instance
   */
  const recognitionRef = useRef<any>(null);

  /**
   * Ref to hold the current line ID for tracking transcripts
   */
  const lineIdRef = useRef(0);

  /**
   * useEffect runs once on mount to initialize Speech Recognition
   */
  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      // Get the SpeechRecognition constructor based on browser
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;

      // Create a new SpeechRecognition instance and store in ref
      recognitionRef.current = new SpeechRecognition();

      // Enable continuous listening (keep listening until explicitly stopped)
      recognitionRef.current.continuous = true;

      // Enable capturing interim results (partial words before finalizing)
      recognitionRef.current.interimResults = true;

      // Set the recognition language
      recognitionRef.current.lang = "en-US";

      /**
       * Event listener when recognition returns results
       */
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""; // Stores finalized speech
        let interimTranscript = ""; // Stores temporary speech

        // Iterate over recognition results from resultIndex to results.length
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            // If the result is final, add to finalTranscript
            finalTranscript += transcript;
          } else {
            // Otherwise, add to interimTranscript
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          // If final transcript is available, add it to transcript list
          setTranscript((prev) => [
            ...prev,
            {
              id: lineIdRef.current++, // unique ID for the line
              text: finalTranscript.trim(), // clean and store text
              timestamp: new Date(), // capture timestamp
            },
          ]);
          setCurrentText(""); // clear interim text
        } else {
          // Otherwise, update interim text while user is speaking
          setCurrentText(interimTranscript);
        }
      };

      /**
       * Event listener for error handling
       */
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false); // stop listening on error
      };

      /**
       * Event listener when speech recognition stops automatically
       */
      recognitionRef.current.onend = () => {
        setIsListening(false); // update state to reflect stopped listening
      };
    }

    /**
     * Cleanup: stop recognition when the component unmounts
     */
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  /**
   * Start listening to user's speech
   */
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setIsMuted(false);
      recognitionRef.current.start(); // start speech recognition
    }
  };

  /**
   * Stop listening to user's speech
   */
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop(); // stop speech recognition
    }
  };

  /**
   * Toggle mute/unmute while listening
   */
  const toggleMute = () => {
    if (isListening) {
      if (isMuted) {
        recognitionRef.current.start(); // resume recognition
      } else {
        recognitionRef.current.stop(); // pause recognition
      }
    }
    setIsMuted(!isMuted);
  };

  /**
   * Reset transcript and clear all recorded speech
   */
  const resetTranscript = () => {
    setTranscript([]); // clear transcript history
    setCurrentText(""); // clear current text
    lineIdRef.current = 0; // reset line ID counter
  };

  /**
   * Render the Speech Recognition UI
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* App header */}
        <Headerkk />

        {/* Microphone UI section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Microphone button with mute toggle */}
          <Microphone
            isListening={isListening}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
          {/* Start, Stop, Reset control buttons */}
          <MicrophoneControlButtons
            isListening={isListening}
            onStart={startListening}
            onStop={stopListening}
            onReset={resetTranscript}
          />
        </div>

        {/* Transcript display section */}
        <Transcript transcript={transcript} currentText={currentText} />

        {/* Show browser support notice if SpeechRecognition not supported */}
        {!(
          "webkitSpeechRecognition" in window || "SpeechRecognition" in window
        ) && <BrowserSupport />}
      </div>
    </div>
  );
};

export default SpeechRecognition;
