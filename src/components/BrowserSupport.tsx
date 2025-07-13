import React from "react";

const BrowserSupport: React.FC = () => {
  const isSupported =
    "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

  if (isSupported) {
    return null;
  }

  return (
    <div className="text-center p-4 bg-yellow-100 rounded-lg border border-yellow-300">
      <p className="text-yellow-800">
        Speech recognition is not supported in your browser. Please try Chrome,
        Edge, or Safari.
      </p>
    </div>
  );
};

export default BrowserSupport;
