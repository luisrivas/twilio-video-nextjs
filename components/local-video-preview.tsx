import { useCall } from '@/contexts/call-context';
import type { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '@/components/video-track';

export default function LocalVideoPreview() {
  const { localTracks } = useCall();

  const videoTrack = localTracks.find((track) => !track.name.includes('screen') && track.kind === 'video') as LocalVideoTrack;

  if (!videoTrack) return null;

  return <VideoTrack track={videoTrack} isLocal={true} />;
}
