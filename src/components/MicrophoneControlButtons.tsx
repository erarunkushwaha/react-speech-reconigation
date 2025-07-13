import React from "react";
import { Mic, MicOff, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MicrophoneControlButtonsProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const MicrophoneControlButtons: React.FC<MicrophoneControlButtonsProps> = ({
  isListening,
  onStart,
  onStop,
  onReset,
}) => {
  return (
    <div className="flex space-x-4">
      <Button
        onClick={onStart}
        disabled={isListening}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Play className="w-4 h-4 mr-2" />
        Start
      </Button>
      <Button
        onClick={onStop}
        disabled={!isListening}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <Square className="w-4 h-4 mr-2" />
        Stop
      </Button>
      <Button
        onClick={onReset}
        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
    </div>
  );
};

export default MicrophoneControlButtons;
