'use client';
import React from 'react';
import PreJoinScreen from '@/components/views/pre-join-screen';
import Room from '@/components/views/room';
import Head from 'next/head';
import useRoomState from '@/hooks/use-room-state';

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const roomState = useRoomState();

  return (
    <>
      <Head>
        <title>Twilio Video App - {slug}</title>
      </Head>
      {roomState !== 'disconnected' ? <Room /> : <PreJoinScreen roomName={slug} />}
    </>
  );
}
