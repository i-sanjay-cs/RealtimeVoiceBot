"use client";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";

import { Chat } from "@/components/chat";
import { Transcript } from "@/components/transcript";
import { useConnection } from "@/hooks/use-connection";
import { AgentProvider } from "@/hooks/use-agent";
import { useRef } from "react";
import { ChevronDown, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RoomComponent() {
  const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const scrollButtonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <LiveKitRoom
      serverUrl={wsUrl}
      token={token}
      connect={shouldConnect}
      audio={true}
      className="flex flex-col md:grid md:grid-cols-[1fr_360px] flex-grow overflow-hidden border-l border-r border-b rounded-b-md"
      style={{ "--lk-bg": "white" } as React.CSSProperties}
      options={{
        publishDefaults: {
          stopMicTrackOnMute: true,
        },
      }}
    >
      <AgentProvider>
        <div className="flex flex-col justify-center w-full max-w-3xl mx-auto">
          {!shouldConnect && (
            <div className="flex flex-col justify-center items-center h-64 p-6">
              <h2 className="text-xl font-medium mb-6 text-center">Ready to start a conversation?</h2>
              <p className="text-sm text-gray-600 mb-8 text-center max-w-md">
                Click the button below to begin your session. The voice assistant will respond to your questions and engage in conversation.
              </p>
              <Button 
                onClick={connect} 
                className="px-6 py-5 text-lg"
                size="lg"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Session
              </Button>
            </div>
          )}
          {shouldConnect && (
            <div className="flex flex-col w-full">
              <div className="p-3 bg-blue-50 text-blue-700 text-sm flex justify-between items-center">
                <span className="flex items-center">
                  <Mic className="h-4 w-4 mr-2 animate-pulse text-green-600" />
                  Conversation in progress
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={disconnect} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <MicOff className="h-4 w-4 mr-1" />
                  End Session
                </Button>
              </div>
              <Chat />
            </div>
          )}
        </div>
        <div className="hidden md:flex flex-col h-full overflow-y-hidden border-l relative">
          <div className="flex-grow overflow-y-auto" ref={transcriptContainerRef}>
            <Transcript
              scrollContainerRef={transcriptContainerRef}
              scrollButtonRef={scrollButtonRef}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              ref={scrollButtonRef}
              className="p-2 bg-white text-gray-500 rounded-full hover:bg-gray-100 transition-colors absolute right-4 bottom-4 shadow-md flex items-center"
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              <span className="text-xs pr-1">View latest</span>
            </button>
          </div>
        </div>
        <RoomAudioRenderer />
        <StartAudio label="Click to enable audio" />
      </AgentProvider>
    </LiveKitRoom>
  );
}
