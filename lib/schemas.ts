import { z } from 'zod';

export const joinCallSchema = z
  .object({
    intent: z.enum(['create', 'join']),
    roomName: z.string(),
  })
  .refine((data) => data.intent === 'create' || (data.intent === 'join' && !!data.roomName.trim()), {
    message: 'Meeting ID is required when joining a meeting.',
    path: ['roomName'],
  });

export const setRoomPreferencesSchema = z.object({
  username: z.string().min(2, {
    message: 'The name must be at least 2 characters.',
  }),
});
