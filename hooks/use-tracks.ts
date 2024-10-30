/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import { useEffect, useState } from 'react';
import { LocalTrack, LocalTrackPublication, RemoteTrack, RemoteTrackPublication, Participant } from 'twilio-video';

type Track = RemoteTrack | LocalTrack;

export default function useTracks(participant: Participant) {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    // todo - review this type assertion, I am not a fan of these solutions but it is what it is
    const subscribedTracks = Array.from(participant.tracks.values() as Iterable<RemoteTrackPublication | LocalTrackPublication>)
      .filter((trackPublication) => trackPublication.track !== null)
      .map((trackPublication) => trackPublication.track!);

    setTracks(subscribedTracks);

    const handleTrackSubscribed = (track: RemoteTrack) => setTracks((prevTracks) => [...prevTracks, track]);
    const handleTrackUnsubscribed = (track: RemoteTrack) => setTracks((prevTracks) => prevTracks.filter((t) => t !== track));

    participant.on('trackSubscribed', handleTrackSubscribed);
    participant.on('trackUnsubscribed', handleTrackUnsubscribed);
    return () => {
      participant.off('trackSubscribed', handleTrackSubscribed);
      participant.off('trackUnsubscribed', handleTrackUnsubscribed);
    };
  }, [participant]);

  return tracks;
}
