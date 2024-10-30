/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { useCallback, useEffect, useState } from 'react';
import { SELECTED_AUDIO_OUTPUT_KEY } from '@/lib/constants';
import useDevices from '@/hooks/use-devices';

export default function useActiveSinkId() {
  const { audioOutputDevices } = useDevices();
  const [activeSinkId, _setActiveSinkId] = useState('default');

  const setActiveSinkId = useCallback((sinkId: string) => {
    window.localStorage.setItem(SELECTED_AUDIO_OUTPUT_KEY, sinkId);
    _setActiveSinkId(sinkId);
  }, []);

  useEffect(() => {
    const selectedSinkId = window.localStorage.getItem(SELECTED_AUDIO_OUTPUT_KEY);
    const hasSelectedAudioOutputDevice = audioOutputDevices.some((device) => selectedSinkId && device.deviceId === selectedSinkId);
    if (hasSelectedAudioOutputDevice) {
      _setActiveSinkId(selectedSinkId!);
    }
  }, [audioOutputDevices]);

  return [activeSinkId, setActiveSinkId] as const;
}
