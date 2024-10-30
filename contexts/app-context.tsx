import useActiveSinkId from '@/hooks/use-active-sink-id';
import React, { createContext, useContext, useState } from 'react';

type StateContextType = {
  username: string;
  setUserName: (username: string) => void;
  activeSinkId: string;
  setActiveSinkId: (sinkId: string) => void;
};

const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [username, setUserName] = useState<string>('');
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();

  const value = {
    username,
    setUserName,
    activeSinkId,
    setActiveSinkId,
  };
  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider');
  }
  return context;
}
