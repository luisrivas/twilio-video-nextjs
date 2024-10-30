'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCall } from '@/contexts/call-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LocalVideoPreview from '../local-video-preview';
import { useAppState } from '@/contexts/app-context';
import { getToken } from '@/app/actions';
import { LocalTracksActionsBar } from '../local-tracks-actions-bar';
import VideoInputList from '../ui/video-input-list';
import AudioInputList from '../ui/audio-input-list';
import AudioOutputList from '../ui/audio-output-list';
import { setRoomPreferencesSchema } from '@/lib/schemas';

export default function PreJoin({ roomName }: { roomName: string }) {
  const { username, setUserName } = useAppState();
  const { getAudioAndVideoTracks, connect } = useCall();

  useEffect(() => {
    try {
      getAudioAndVideoTracks();
    } catch (error) {
      console.error('Error getting audio and video tracks:', error);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(setRoomPreferencesSchema),
    defaultValues: {
      username,
    },
  });

  const onSubmit = async ({ username }: z.infer<typeof setRoomPreferencesSchema>) => {
    setUserName(username);
    try {
      const token = await getToken(roomName, username);

      if (token) {
        connect(token);
      } else {
        console.error('No token received');
      }
    } catch (error) {
      console.error('Error connecting to room:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <main className="container mx-auto flex self-center">
        <div className="flex flex-1 flex-col gap-3">
          <div className="w-full aspect-video">
            <div className="relative bg-zinc-900 h-full rounded-md overflow-hidden">
              <LocalVideoPreview />
              <LocalTracksActionsBar />
            </div>
          </div>
          <div className="flex gap-3">
            <AudioInputList />
            <AudioOutputList />
            <VideoInputList />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What&apos;s your name?</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Join Me</Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
