"use client";

import { Mic } from "lucide-react";

export function Header() {
  return (
    <div className="flex flex-shrink-0 flex-col p-4 border-l border-r border-t rounded-t-md bg-gradient-to-r from-white to-blue-50">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Mic className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Voice Assistant</h2>
      </div>
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-gray-600 max-w-xl">
          Interactive voice-based assistant that responds to your questions in real-time.
          Speak naturally and your conversation will be transcribed as you talk.
        </p>
      </div>
    </div>
  );
}
