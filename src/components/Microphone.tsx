import React from "react";
import { Mic, MicOff, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MicrophoneProps {
  isListening: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

const Microphone: React.FC<MicrophoneProps> = ({
  isListening,
  isMuted,
  onToggleMute,
}) => {
  const getMicrophoneStatus = () => {
    if (isMuted) return "Microphone: Muted";
    if (isListening) return "Microphone: Listening";
    return "Microphone: Off";
  };

  const getMicrophoneStatusColor = () => {
    if (isMuted) return "text-red-600";
    if (isListening) return "text-blue-600";
    return "text-gray-500";
  };

  return (
    <>
      {/* Status Indicator */}
      <div
        className={`text-lg font-medium transition-colors duration-300 ${getMicrophoneStatusColor()}`}
      >
        {getMicrophoneStatus()}
      </div>

      {/* Microphone Button */}
      <div className="relative">
        <button
          onClick={onToggleMute}
          className={`
                    relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                    ${
                      isListening && !isMuted
                        ? "bg-blue-500 hover:bg-blue-600 animate-pulse-mic"
                        : isMuted
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }
                  `}
        >
          {isMuted ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}

          {/* Mute slash overlay */}
          {isMuted && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-0.5 bg-white rotate-45 opacity-80"></div>
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default Microphone;
