"use client";

import { useState, useEffect } from "react";
import { SessionControls } from "@/components/session-controls";
import { ConnectionState } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  useConnectionState,
  useVoiceAssistant,
  BarVisualizer,
} from "@livekit/components-react";
import { useAgent } from "@/hooks/use-agent";
import { useConnection } from "@/hooks/use-connection";
import { toast } from "@/hooks/use-toast";
import { Mic, Volume2 } from 'lucide-react';

export function Chat() {
  const connectionState = useConnectionState();
  const { audioTrack, state } = useVoiceAssistant();
  const [isChatRunning, setIsChatRunning] = useState(false);
  const { agent } = useAgent();
  const { disconnect } = useConnection();
  const [hasSeenAgent, setHasSeenAgent] = useState(false);

  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout | undefined;
    let appearanceTimer: NodeJS.Timeout | undefined;

    if (connectionState === ConnectionState.Connected && !agent) {
      appearanceTimer = setTimeout(() => {
        disconnect();
        setHasSeenAgent(false);

        toast({
          title: "Assistant Unavailable",
          description:
            "Unable to connect to the assistant right now. Please try again in a few moments.",
          variant: "destructive",
        });
      }, 5000);
    }

    if (agent) {
      setHasSeenAgent(true);
    }

    if (
      connectionState === ConnectionState.Connected &&
      !agent &&
      hasSeenAgent
    ) {
      // Agent disappeared while connected, wait 5s before disconnecting
      disconnectTimer = setTimeout(() => {
        if (!agent) {
          disconnect();
          setHasSeenAgent(false);
        }

        toast({
          title: "Conversation Interrupted",
          description:
            "The assistant has unexpectedly disconnected. You can restart the conversation.",
          variant: "destructive",
        });
      }, 5000);
    }

    setIsChatRunning(
      connectionState === ConnectionState.Connected && hasSeenAgent,
    );

    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
      if (appearanceTimer) clearTimeout(appearanceTimer);
    };
  }, [connectionState, agent, disconnect, hasSeenAgent]);

  const renderVisualizer = () => (
    <div className="relative flex flex-col items-center justify-center gap-4 pt-4">
      <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
        {state !== "speaking" ? (
          <Mic className="h-12 w-12 text-blue-500" />
        ) : (
          <Volume2 className="h-12 w-12 text-green-500 animate-pulse" />
        )}
      </div>
      <BarVisualizer
        state={state}
        barCount={7}
        trackRef={audioTrack}
        className="w-full h-full"
      />
      <div
        className={`transition-all duration-300 my-4 py-2 px-4 rounded-lg text-center ${
          state === "listening"
            ? "bg-blue-50 text-blue-700"
            : "bg-transparent text-gray-400"
        }`}
      >
        <div className="text-sm font-medium">
          {state === "speaking"
            ? "The assistant is speaking..."
            : state === "listening"
            ? "The assistant is listening..."
            : "It's your turn to speak. Ask a question to begin."}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Your conversation will be recorded in the transcript panel
        </div>
      </div>
    </div>
  );

  const renderConnectionControl = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={isChatRunning ? "session-controls" : "connect-button"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "tween", duration: 0.15, ease: "easeInOut" }}
      >
        {isChatRunning ? <SessionControls /> : null}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden p-2 lg:p-4">
      <div className="flex flex-col flex-grow items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center">
          {audioTrack ? (
            renderVisualizer()
          ) : (
            <div className="text-center space-y-6 max-w-lg mx-auto p-6">
              <div className="text-2xl font-semibold">Voice Assistant</div>
              <div className="text-md text-gray-600">
                <p className="mb-3">This AI-powered voice assistant can answer questions and engage in natural conversation.</p>
                <p>You&apos;ll receive real-time responses and be able to have a normal conversation.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-100">
                <p className="font-medium mb-2">Tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Speak clearly and at a natural pace</li>
                  <li>Ask one question at a time</li>
                  <li>Allow the assistant to finish speaking before asking your next question</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="md:mt-2 md:pt-2 md:mb-12 max-md:fixed max-md:bottom-12 max-md:left-1/2 max-md:-translate-x-1/2 max-md:z-50 xl:fixed xl:bottom-12 xl:left-1/2 xl:-translate-x-1/2 xl:z-50">
          {renderConnectionControl()}
        </div>
      </div>
    </div>
  );
}
