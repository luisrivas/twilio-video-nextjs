/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track?.isEnabled || false);

  useEffect(() => {
    // Set initial state
    setIsEnabled(track?.isEnabled || false);

    if (!track) return;

    const handleEnabled = () => setIsEnabled(true);
    const handleDisabled = () => setIsEnabled(false);

    // Add listeners for enable/disable events
    track.on('enabled', handleEnabled);
    track.on('disabled', handleDisabled);

    // Cleanup listeners
    return () => {
      track.off('enabled', handleEnabled);
      track.off('disabled', handleDisabled);
    };
  }, [track]);

  return isEnabled;
}
