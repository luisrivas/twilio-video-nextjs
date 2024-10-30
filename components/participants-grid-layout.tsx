'use client';
import { useCall } from '@/contexts/call-context';
import useParticipants from '@/hooks/use-participants';
import Participant from './participant';

export function ParticipantsGridLayout() {
  const { room } = useCall();
  const participants = useParticipants();
  if (!room) {
    throw new Error('ParticipantsGridLayout need to be rendered in a Room');
  }
  return (
    <div className={`${getGridLayout(participants.length + 1)} gap-2 aspect-video max-h-[calc(100vh-2rem)]`}>
      {[room.localParticipant, ...participants].map((participant, index) => (
        <div key={participant.sid} className="w-full h-full rounded-lg relative overflow-hidden flex items-center justify-center">
          <Participant participant={participant} isLocal={index === 0} />
        </div>
      ))}
    </div>
  );
}

/**
 * Determine the grid layout based on the number of participants
 * @param {number} participantCount - The number of participants in the call
 * @returns {string} CSS classes for the grid layout
 */
const getGridLayout = (participantCount: number): string => {
  if (participantCount <= 1) {
    return 'w-full h-full';
  } else if (participantCount <= 4) {
    return 'grid grid-cols-2 h-full';
  } else {
    return 'grid grid-cols-3 h-full';
  }
};
