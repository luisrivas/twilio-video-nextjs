'use client';

import { Mic, MicOff, Phone, CircleUserRound, Video as VideoIcon, VideoOff } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Participant from '../participant';
import { useCall } from '@/contexts/call-context';
import useLocalTracks from '@/hooks/user-local-tracks';
import useIsTrackEnabled from '@/hooks/use-is-track-enable';
import useParticipants from '@/hooks/use-participants';
import { useEffect } from 'react';
import VideoTrack from '../video-track';

export default function Room() {
  const { localTracks, getAudioAndVideoTracks } = useCall();

  const videoTrack = localTracks.find((track) => !track.name.includes('screen') && track.kind === 'video');

  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    getAudioAndVideoTracks();
  }, []);
  // useLocalTracks();

  // if (!room) {
  //   // this component should only be rendered when there is a room
  //   return null;
  // }

  // Include the local participant

  // const participantCount = allParticipants.length;
  // const rows = Math.ceil(Math.sqrt(participantCount));
  // const participantHeight = 100 / rows + "%";

  // const participantCount = participants.length;
  // const hasRemoteParticipants = participantCount > 0;

  // let rows = 1;
  // let participantHeight = '100%';
  // if (participantCount > 1) {
  //   rows = Math.ceil(Math.sqrt(participantCount));
  //   participantHeight = 100 / rows + '%';
  // }

  return (
    <div className="flex justify-center items-center h-screen w-screen m-0 bg-zinc-800 overflow-hidden">
      {true ? (
        <div
          className="grid gap-2 w-full h-full p-2 box-border"
          style={{
            gridTemplateColumns: getGridTemplateColumns(3),
            gridAutoRows: '1fr',
          }}
        >
          <div className="bg-black text-white text-xl rounded-lg overflow-hidden">
            <VideoTrack track={videoTrack} isLocal={true} />
          </div>
          <div className="bg-black text-white text-xl rounded-lg overflow-hidden">
            <VideoTrack track={videoTrack} isLocal={true} />
          </div>
          <div className="bg-black text-white text-xl rounded-lg overflow-hidden">
            <VideoTrack track={videoTrack} isLocal={true} />
          </div>
        </div>
      ) : (
        <Spotlight>
          {/* <Participant participant={localParticipant} isLocal={true} /> */}
          <VideoTrack track={videoTrack} isLocal={true} />
        </Spotlight>
      )}

      {/* Menu Bar */}
      <MenuBar />
    </div>
  );
}

function getGridTemplateColumns(participantCount) {
  const columns = calculateOptimalColumns(participantCount);
  return `repeat(${columns}, 1fr)`;
}

function calculateOptimalColumns(participantCount) {
  if (participantCount === 1) return 1;
  if (participantCount === 2) return 2;
  if (participantCount === 3) return 2;
  if (participantCount === 4) return 2;
  if (participantCount === 5) return 3;
  if (participantCount === 6) return 3;
  if (participantCount === 7) return 3;
  if (participantCount === 8) return 4;
  if (participantCount === 9) return 3;
  if (participantCount <= 12) return 4;
  return Math.ceil(Math.sqrt(participantCount));
}

function Spotlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-grow relative">
      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">{children}</div>
    </div>
  );
}

function MenuBar() {
  const { localTracks } = useCall();

  const audioTrack = localTracks.find((track) => track.kind === 'audio');
  const videoTrack = localTracks.find((track) => track.kind === 'video');

  const isMicOn = useIsTrackEnabled(audioTrack);
  const isCameraOn = useIsTrackEnabled(videoTrack);

  const onToggleMute = () => (audioTrack?.isEnabled ? audioTrack.disable() : audioTrack?.enable());
  const onToggleCamera = () => (videoTrack?.isEnabled ? videoTrack.disable() : videoTrack?.enable());
  const onDisconnect = () => {};

  return (
    <>
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
          <Button className="text-background" variant="destructive" size="icon" onClick={onDisconnect}>
            <Phone className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
