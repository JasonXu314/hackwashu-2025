import { useEffect, useRef, useState } from 'react';
import { HumeClient } from 'hume';

const useHume = () => {
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const socketRef = useRef<any>(null);

  const startChat = async () => {
    const client = new HumeClient({
      apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
      secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
    });

    const socket = await client.empathicVoice.chat.connect({
      configId: '60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161'
    });

    socketRef.current = socket;

    (socket as any).on('transcript', (data: any) => {
      setTranscript(data.transcript.text);
    });

    
    (socket as any).on('message', (data: any) => {
      setReply(data.message.content);
    });

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    await socket.sendAudioInput({data: stream});
  };

  const stopChat = () => {
    socketRef.current?.stop();
    socketRef.current?.disconnect();
  };

  return { startChat, stopChat, transcript, reply };
};
