import React from 'react';
import { useAppState } from '@/contexts/app-context';
import useDevices from '@/hooks/use-devices';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Volume2 } from 'lucide-react';

export default function AudioOutputList() {
  const { audioOutputDevices } = useDevices();
  const { activeSinkId, setActiveSinkId } = useAppState();

  return (
    <Select value={activeSinkId} onValueChange={setActiveSinkId}>
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select an audio output" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Audio Outputs</SelectLabel>
          {audioOutputDevices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              <Volume2 className="inline-block mr-1" size={14} />
              {device.label || `Audio Output ${device.deviceId}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
