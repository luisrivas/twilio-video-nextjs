import React from 'react';

import { Mic, MicOff, Phone, Video as VideoIcon, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useIsTrackEnabled from '@/hooks/use-is-track-enabled';
import { useCall } from '@/contexts/call-context';

export function LocalTracksActionsBar() {
  const { localTracks, room } = useCall();
  const isMicOn = useIsTrackEnabled(localTracks.find((track) => track.kind === 'audio'));
  const isCameraOn = useIsTrackEnabled(localTracks.find((track) => track.kind === 'video'));

  const onToggleMute = () => {
    const audioTrack = localTracks.find((track) => track.kind === 'audio');
    if (audioTrack) {
      audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
    }
  };

  const onToggleCamera = () => {
    const videoTrack = localTracks.find((track) => track.kind === 'video');
    if (videoTrack) {
      videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable();
    }
  };

  const onDisconnect = () => {
    if (!room) return;
    room.disconnect();
  };

  return (
    <div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        <div className="flex gap-4">
          <Button
            className={cn('text-background', isMicOn && 'bg-inherit')}
            variant={!isMicOn ? 'destructive' : 'outline'}
            size="icon"
            onClick={onToggleMute}
          >
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Button
            className={cn('text-background', isCameraOn && 'bg-inherit')}
            variant={isCameraOn ? 'outline' : 'destructive'}
            size="icon"
            onClick={onToggleCamera}
          >
            {isCameraOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          {room && (
            <Button className="text-background" variant="destructive" size="icon" onClick={onDisconnect}>
              <Phone className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
