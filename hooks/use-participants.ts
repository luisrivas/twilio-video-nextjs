/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import { useCall } from '@/contexts/call-context';

export default function useParticipants() {
  const { room } = useCall();
  const [participants, setParticipants] = useState(Array.from(room?.participants.values() ?? []));

  useEffect(() => {
    if (room) {
      const participantConnected = (participant: RemoteParticipant) =>
        setParticipants((prevParticipants) => [...prevParticipants, participant]);

      const participantDisconnected = (participant: RemoteParticipant) =>
        setParticipants((prevParticipants) => prevParticipants.filter((p) => p !== participant));

      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      return () => {
        room.off('participantConnected', participantConnected);
        room.off('participantDisconnected', participantDisconnected);
      };
    }
  }, [room]);

  return participants;
}
