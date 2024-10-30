/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import { useCall } from '@/contexts/call-context';
import useLocalTracks from './use-local-tracks';

export default function useLocalVideoToggle() {
  const { room, localTracks } = useCall();
  const { getLocalVideoTrack, removeLocalVideoTrack } = useLocalTracks();
  const localParticipant = room?.localParticipant;
  const videoTrack = localTracks.find((track) => !track.name.includes('screen') && track.kind === 'video') as LocalVideoTrack;
  const [isPublishing, setIspublishing] = useState(false);

  const toggleVideoEnabled = useCallback(() => {
    if (!isPublishing) {
      if (videoTrack) {
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        setIspublishing(true);
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
          .catch((error) => console.error('Error enabling video:', error))
          .finally(() => {
            setIspublishing(false);
          });
      }
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
