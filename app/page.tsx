'use client';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { joinCall } from '@/app/actions';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { joinCallSchema } from '@/lib/schemas';

export default function Home() {
  const form = useForm<z.infer<typeof joinCallSchema>>({
    resolver: zodResolver(joinCallSchema),
    defaultValues: {
      roomName: '',
      intent: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof joinCallSchema>) => {
    try {
      await joinCall({
        intent: data.intent,
        roomName: data.roomName,
      });
    } catch (error) {
      console.error('Error joining call:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <main className="container mx-auto flex self-center">
        <div className="flex flex-col mx-auto items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-1">Connecting people wherever they are</h2>
          <p className="text-sm text-zinc-500 tracking-tight">Bringing people together through connection and collaboration</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <Button className="mt-6 w-full" name="intent" value="create" type="submit" onClick={() => form.setValue('intent', 'create')}>
                <Video /> New meeting
              </Button>

              <div className="relative flex items-center w-full my-8">
                <hr className="w-full border-t border-zinc-200" />
                <span className="absolute bg-background px-2 text-muted-foreground text-xs uppercase left-1/2 transform -translate-x-1/2">
                  Or join a meeting
                </span>
              </div>
              <div className="flex w-full gap-2">
                <FormField
                  name="roomName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input className="flex-1" placeholder="Enter the meeting ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="secondary" name="intent" value="join" onClick={() => form.setValue('intent', 'join')}>
                  Join me
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-muted-foreground text-xs mt-6 text-center max-w-prose">
            This demo application leverages{' '}
            <a className="underline" href="https://www.twilio.com/docs/video">
              Twilio Video
            </a>{' '}
            for video calls. To create your own WebRTC application using Twilio Video, check out the{' '}
            <a className="underline" href="https://github.com/twilio/twilio-video.js">
              Twilio Video.js repository
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
