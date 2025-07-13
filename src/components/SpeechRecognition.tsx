
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TranscriptLine {
  id: number;
  text: string;
  timestamp: Date;
}

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentText, setCurrentText] = useState('');
  const recognitionRef = useRef<any>(null);
  const lineIdRef = useRef(0);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prev => [...prev, {
            id: lineIdRef.current++,
            text: finalTranscript.trim(),
            timestamp: new Date()
          }]);
          setCurrentText('');
        } else {
          setCurrentText(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
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
    setCurrentText('');
    lineIdRef.current = 0;
  };

  const getMicrophoneStatus = () => {
    if (isMuted) return 'Microphone: Muted';
    if (isListening) return 'Microphone: Listening';
    return 'Microphone: Off';
  };

  const getMicrophoneStatusColor = () => {
    if (isMuted) return 'text-red-600';
    if (isListening) return 'text-blue-600';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Speech Recognition</h1>
          <p className="text-gray-600">Speak naturally and watch your words appear</p>
        </div>

        {/* Microphone Section */}
        <div className="flex flex-col items-center space-y-6">
          {/* Status Indicator */}
          <div className={`text-lg font-medium transition-colors duration-300 ${getMicrophoneStatusColor()}`}>
            {getMicrophoneStatus()}
          </div>

          {/* Microphone Button */}
          <div className="relative">
            <button
              onClick={toggleMute}
              className={`
                relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                ${isListening && !isMuted 
                  ? 'bg-blue-500 hover:bg-blue-600 animate-pulse-mic' 
                  : isMuted 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-300 hover:bg-gray-400'
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

          {/* Control Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={startListening}
              disabled={isListening}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            
            <Button
              onClick={stopListening}
              disabled={!isListening}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
            
            <Button
              onClick={resetTranscript}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Transcript Section */}
        <Card className="w-full max-w-3xl mx-auto p-6 bg-white/70 backdrop-blur-sm shadow-lg">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Live Transcript</h2>
            
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

        {/* Browser Support Notice */}
        {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
          <div className="text-center p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <p className="text-yellow-800">
              Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechRecognition;
