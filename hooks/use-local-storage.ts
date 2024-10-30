/*
 * This code is adapted from the Twilio Video App React repository:
 * https://github.com/twilio/twilio-video-app-react
 */
import React, { useEffect, useState } from 'react';

/* This hook is like a useState() hook, but it will store the state in LocalStorage.
   If a value exists in LocalStorage, it will be returned as the initial value when
   this hook is run for the first time. Because this hook uses LocalStorage, it can 
   only use values that can be serialized to and from JSON.
*/

export function useLocalStorageState<T>(key: string, initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialState);

  // Load from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    }
  }, [key]);

  // Update localStorage whenever the value changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}
