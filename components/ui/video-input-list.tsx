import { useCall } from '@/contexts/call-context';
import useDevices from '@/hooks/use-devices';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import useMediaStreamTrack from '@/hooks/use-media-stream-track';
import { DEFAULT_VIDEO_CONSTRAINTS, SELECTED_VIDEO_INPUT_KEY } from '@/lib/constants';
import { LocalVideoTrack } from 'twilio-video';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoIcon } from 'lucide-react';

export default function VideoInputList() {
  const { videoInputDevices } = useDevices();
  const { localTracks } = useCall();

  const localVideoTrack = localTracks.find((track) => track.kind === 'video') as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  const [storedLocalVideoDeviceId, setStoredLocalVideoDeviceId] = useLocalStorageState(SELECTED_VIDEO_INPUT_KEY, '');
  const localVideoInputDeviceId = mediaStreamTrack?.getSettings().deviceId || storedLocalVideoDeviceId;

  function replaceTrack(newDeviceId: string) {
    setStoredLocalVideoDeviceId(newDeviceId);
    localVideoTrack?.restart({
      ...DEFAULT_VIDEO_CONSTRAINTS,
      deviceId: { exact: newDeviceId },
    });
  }

  return (
    <Select value={localVideoInputDeviceId} onValueChange={replaceTrack}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select a camera" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cameras</SelectLabel>
          {videoInputDevices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              <VideoIcon className="inline-block mr-1" size={14} />
              {device.label || `Camera ${device.deviceId}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
