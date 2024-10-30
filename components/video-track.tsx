/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
'use client';

import { useEffect, useRef } from 'react';
import { Track, LocalVideoTrack, RemoteVideoTrack } from 'twilio-video';
import { cn } from '@/lib/utils';
import useMediaStreamTrack from '@/hooks/use-media-stream-track';

type VideoTrackProps = {
  track: RemoteVideoTrack | LocalVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
};

export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);

  useEffect(() => {
    const videoElement = videoRef.current;
    videoElement.muted = true;

    if ('setPriority' in track && priority) {
      track.setPriority(priority);
    }

    track.attach && track.attach(videoElement);

    return () => {
      track.detach && track.detach(videoElement);

      // This addresses a Chrome issue where the number of WebMediaPlayers is limited.
      // See: https://github.com/twilio/twilio-video.js/issues/1528
      videoElement.srcObject = null;

      if ('setPriority' in track && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // Mirror the local video if it's the front camera
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const videoClassName = cn('w-full h-full aspect-video', isLocal && isFrontFacing && 'transform-gpu scale-x-[-1]');

  return <video ref={videoRef} muted={isLocal} autoPlay playsInline className={videoClassName} />;
}
