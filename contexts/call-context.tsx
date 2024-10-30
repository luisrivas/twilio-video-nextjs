/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
'use client';

import React, { createContext, useContext } from 'react';
import Video from 'twilio-video';
import useRoom from '@/hooks/use-room';
import useLocalTracks from '@/hooks/use-local-tracks';
import useConnectionOptions from '@/hooks/use-connect-options';

type state = {
  localTracks: (Video.LocalAudioTrack | Video.LocalVideoTrack)[];
  getAudioAndVideoTracks: () => Promise<void>;
  room: Video.Room | null;
  isConnecting: boolean;
  connect: (token: string) => Promise<void>;
};

const defaultValue: state = {
  localTracks: [],
  getAudioAndVideoTracks: async () => {},
  room: null,
  isConnecting: false,
  connect: async () => {},
};
const CallContext = createContext(defaultValue);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const { localTracks, getAudioAndVideoTracks } = useLocalTracks();

  const connectionOptions = useConnectionOptions();

  const { room, isConnecting, connect } = useRoom(
    localTracks,
    (error) => {
      console.error(`Room error: ${error.message}`, error);
    },
    connectionOptions
  );

  return (
    <CallContext.Provider
      value={{
        localTracks,
        getAudioAndVideoTracks,
        room,
        isConnecting,
        connect,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const value = useContext(CallContext);
  if (value === undefined) {
    throw new Error('Context value is undefined, are you missing a context provider?');
  }
  return value;
}
