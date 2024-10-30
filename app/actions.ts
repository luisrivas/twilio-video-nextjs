'use server';
import { redirect } from 'next/navigation';
import { Twilio, jwt as TwilioJWT } from 'twilio';
import { nanoid } from 'nanoid';
import { joinCallSchema } from '@/lib/schemas';
import { z } from 'zod';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function getToken(roomName: string, identity: string): Promise<string> {
  if (!twilioAccountSid || !twilioApiKey || !twilioApiSecret) {
    throw new Error('Twilio environment variables are missing.');
  }

  try {
    const videoGrant = new TwilioJWT.AccessToken.VideoGrant({
      room: roomName,
    });

    const token = new TwilioJWT.AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret, { identity });
    token.addGrant(videoGrant);

    return token.toJwt();
  } catch (error) {
    console.error('Error generating Twilio token:', error);
    throw new Error('Failed to generate Twilio token');
  }
}

export async function joinCall(data: z.infer<typeof joinCallSchema>) {
  let room;
  if (data.intent === 'create') {
    room = await client.video.v1.rooms.create({
      // Generate a random room name for the call. Nanoid is not required, but I like to keep it short and unique.
      uniqueName: nanoid(5),
    });
  } else {
    room = await client.video.v1.rooms(data.roomName).fetch();
  }
  if (!room) {
    return { error: 'Unable to create or join the call', success: false };
  }
  redirect(`/${room.uniqueName}`);
}
