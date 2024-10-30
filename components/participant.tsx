'use client';

import { Participant as IParticipant } from 'twilio-video';
import VideoTrackComponent from './video-track';
import useTracks from '@/hooks/use-tracks';
import useIsTrackEnabled from '@/hooks/use-is-track-enabled';
import { Mic, MicOff } from 'lucide-react';
import { Button } from './ui/button';
type ParticipantProps = {
  participant: IParticipant;
  isLocal: boolean;
};

export default function Participant({ participant, isLocal }: ParticipantProps) {
  const tracks = useTracks(participant);

  const videoTrack = tracks.find((track) => track.kind === 'video');
  const audioTrack = tracks.find((track) => track.kind === 'audio');

  const isVideoEnabled = useIsTrackEnabled(videoTrack);
  const isAudioEnabled = useIsTrackEnabled(audioTrack);

  return (
    <div className="relative w-full flex items-center rounded-md overflow-hidden bg-red-400">
      {!isLocal && (
        <div className="absolute top-2 right-2 p-1 bg-black/60 rounded-full">
          <Button variant="ghost" disabled className="rounded-full h-8 w-8">
            {isAudioEnabled ? <Mic className="text-white w-5 h-5" /> : <MicOff className="text-white w-5 h-5" />}
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center w-full h-full bg-zinc-900">
        {videoTrack && isVideoEnabled ? (
          <VideoTrackComponent track={videoTrack} isLocal={isLocal} />
        ) : (
          <p className="text-xl text-white select-none">{isLocal ? `${participant.identity} (You)` : participant.identity}</p>
        )}
      </div>
    </div>
  );
}
