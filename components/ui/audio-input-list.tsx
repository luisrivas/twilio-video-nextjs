import { useCall } from '@/contexts/call-context';
import useDevices from '@/hooks/use-devices';
import { useLocalStorageState } from '@/hooks/use-local-storage';
import useMediaStreamTrack from '@/hooks/use-media-stream-track';
import { SELECTED_VIDEO_INPUT_KEY } from '@/lib/constants';
import { LocalVideoTrack } from 'twilio-video';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic } from 'lucide-react';

export default function AudioInputList() {
  const { audioInputDevices } = useDevices();
  const { localTracks } = useCall();

  const localAudioTrack = localTracks.find((track) => track.kind === 'audio') as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localAudioTrack);
  const [storedLocalAudioDeviceId, setStoredLocalAudioDeviceId] = useLocalStorageState(SELECTED_VIDEO_INPUT_KEY, '');
  const localAudioInputDeviceId = mediaStreamTrack?.getSettings().deviceId || storedLocalAudioDeviceId;

  function replaceTrack(newDeviceId: string) {
    setStoredLocalAudioDeviceId(newDeviceId);
    localAudioTrack?.restart({ deviceId: { exact: newDeviceId } });
  }

  return (
    <Select value={localAudioInputDeviceId} onValueChange={replaceTrack}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select a microphone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Microphones</SelectLabel>
          {audioInputDevices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              <Mic className="inline-block mr-1" size={14} />
              {device.label || `Microphone ${device.deviceId}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
