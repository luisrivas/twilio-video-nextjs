'use client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Retrieves information about the available media devices on the user's system.
 *
 * @returns {Promise<{
 *   audioInputDevices: MediaDeviceInfo[],
 *   videoInputDevices: MediaDeviceInfo[],
 *   audioOutputDevices: MediaDeviceInfo[],
 *   hasAudioInputDevices: boolean,
 *   hasVideoInputDevices: boolean
 * }>} An object containing arrays of audio input, video input, and audio output devices,
 * and boolean flags indicating the presence of audio and video input devices.
 */
export async function getDeviceInfo(): Promise<{
  audioInputDevices: MediaDeviceInfo[];
  videoInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  hasAudioInputDevices: boolean;
  hasVideoInputDevices: boolean;
}> {
  const devices = await navigator.mediaDevices.enumerateDevices();

  return {
    audioInputDevices: devices.filter((device) => device.kind === 'audioinput'),
    videoInputDevices: devices.filter((device) => device.kind === 'videoinput'),
    audioOutputDevices: devices.filter((device) => device.kind === 'audiooutput'),
    hasAudioInputDevices: devices.some((device) => device.kind === 'audioinput'),
    hasVideoInputDevices: devices.some((device) => device.kind === 'videoinput'),
  };
}

// This function will return 'true' when the specified permission has been denied by the user.
// If the API doesn't exist, or the query function returns an error, 'false' will be returned.
export async function isPermissionDenied(name: 'camera' | 'microphone'): Promise<boolean> {
  if (!navigator.permissions) {
    return false;
  }

  try {
    // Using 'as PermissionName' due to https://github.com/microsoft/TypeScript/issues/33923
    const result = await navigator.permissions.query({ name: name as PermissionName });
    return result.state === 'denied';
  } catch (error) {
    console.warn(`Error querying permission for ${name}:`, error);
    return false;
  }
}

export const isMobile = (() => {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

export function isPlainObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

// Recursively removes any object keys with a value of undefined
export function removeUndefineds<T>(obj: T): T {
  if (!isPlainObject(obj)) return obj;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const target: { [name: string]: any } = {};

  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== 'undefined') {
      target[key] = removeUndefineds(val);
    }
  }

  return target as T;
}
