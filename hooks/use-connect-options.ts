/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { ConnectOptions } from 'twilio-video';
import { isMobile, removeUndefineds } from '@/lib/utils';

// todo: add settings logic to app context
export const initialSettings = {
  trackSwitchOffMode: undefined,
  dominantSpeakerPriority: 'standard',
  bandwidthProfileMode: 'collaboration',
  maxAudioBitrate: '16000',
  contentPreferencesMode: 'auto',
  clientTrackSwitchOffControl: 'auto',
} as const;

export default function useConnectionOptions() {
  // See: https://sdk.twilio.com/js/video/releases/2.0.0/docs/global.html#ConnectOptions
  // for available connection options.
  const connectionOptions: ConnectOptions = {
    // Bandwidth Profile, Dominant Speaker, and Network Quality
    // features are only available in Small Group or Group Rooms.
    // Please set "Room Type" to "Group" or "Small Group" in your
    // Twilio Console: https://www.twilio.com/console/video/configure
    bandwidthProfile: {
      video: {
        mode: initialSettings.bandwidthProfileMode,
        dominantSpeakerPriority: initialSettings.dominantSpeakerPriority,
        trackSwitchOffMode: initialSettings.trackSwitchOffMode,
        contentPreferencesMode: initialSettings.contentPreferencesMode,
        clientTrackSwitchOffControl: initialSettings.clientTrackSwitchOffControl,
      },
    },
    dominantSpeaker: true,
    networkQuality: { local: 1, remote: 1 },

    // Comment this line if you are playing music.
    maxAudioBitrate: Number(initialSettings.maxAudioBitrate),

    preferredVideoCodecs: 'auto',
  };

  // For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
  if (isMobile && connectionOptions?.bandwidthProfile?.video) {
    connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
  }

  // Here we remove any 'undefined' values. The twilio-video SDK will only use defaults
  // when no value is passed for an option. It will throw an error when 'undefined' is passed.
  return removeUndefineds(connectionOptions);
}
