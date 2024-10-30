'use client';

import { useCall } from '@/contexts/call-context';
import { ParticipantAudioTracks } from '../participant-audio-tracks';
import { LocalTracksActionsBar } from '../local-tracks-actions-bar';
import { ParticipantsGridLayout } from '../participants-grid-layout';

export default function Room() {
  const { room } = useCall();

  if (!room) {
    // this component should only be rendered when there is a room
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen m-0 bg-zinc-800 overflow-hidden">
      <ParticipantsGridLayout />
      <ParticipantAudioTracks />
      <LocalTracksActionsBar />
    </div>
  );
}
