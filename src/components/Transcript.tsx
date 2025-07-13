import React from "react";
import { Card } from "@/components/ui/card";
import { TranscriptLine } from "./SpeechRecognition";

interface TranscriptProps {
  transcript: TranscriptLine[];
  currentText: string;
}

const Transcript: React.FC<TranscriptProps> = ({ transcript, currentText }) => (
  <Card className="w-full max-w-3xl mx-auto p-6 bg-white/70 backdrop-blur-sm shadow-lg">
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Live Transcript
      </h2>
      <div className="min-h-[300px] max-h-[400px] overflow-y-auto space-y-2 p-4 bg-gray-50/50 rounded-lg">
        {transcript.length === 0 && !currentText && (
          <p className="text-gray-500 italic text-center py-8">
            Your speech will appear here...
          </p>
        )}
        {transcript.map((line) => (
          <div
            key={line.id}
            className="animate-fade-in-up p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-400"
          >
            <p className="text-gray-800 font-mono text-sm leading-relaxed">
              {line.text}
            </p>
            <span className="text-xs text-gray-500 mt-1 block">
              {line.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        {currentText && (
          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-300 animate-pulse">
            <p className="text-gray-700 font-mono text-sm leading-relaxed">
              {currentText}
              <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
            </p>
            <span className="text-xs text-blue-600 mt-1 block">
              Listening...
            </span>
          </div>
        )}
      </div>
    </div>
  </Card>
);

export default Transcript;
