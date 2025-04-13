// Client-side React (Next.js or plain React) example to:
// - Record mic input
// - Send audio to Hume via WebSocket
// - Receive transcribed + LLM-generated response (text only)

import React, { useEffect, useRef, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { fetchAccessToken } from 'hume';
import { Hume, HumeClient } from 'hume';

export const getServerSideProps = async () => {
	const accessToken = await fetchAccessToken({
		apiKey: String(process.env.NEXT_PUBLIC_HUME_API_KEY),
		secretKey: String(process.env.NEXT_PUBLIC_HUME_SECRET_KEY),
	});

	if (!accessToken) {
		return {
			redirect: {
				destination: '/error',
				permanent: false,
			},
		};
	}

	return {
		props: {
			accessToken,
		},
	};
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function VoiceTherapist({ accessToken }: PageProps) {
	const HUME_WS_URL = `wss://api.hume.ai/v0/evi/chat?access_token=${accessToken}`;
	const socketRef = useRef<WebSocket | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [messages, setMessages] = useState<string[]>([]);

	// const client = new HumeClient({
	// 	apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
	// 	secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
	// });

	// const socket = await client.empathicVoice.chat.connect({
	//     configId: '60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161'
	//   });

	useEffect(() => {
		if (!navigator.mediaDevices.getUserMedia) return;

		socketRef.current = new WebSocket(HUME_WS_URL);

		socketRef.current.onopen = () => {
			console.log('WebSocket connected');
			socketRef.current?.send(
				JSON.stringify({
					type: 'start',
					// configId: '60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161',
					config: {
						response: { mode: 'text', speak: true },
						insightTypes: ['emotion'],
						audio: true,
					},
				})
			);
		};

		socketRef.current.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data);
			if (data.type === 'evi_response') {
				setMessages((prev) => [...prev, `🧠 ${data.message.content}`]);
			}
			if (data.type === 'transcript_response') {
				setMessages((prev) => [...prev, `🎤 ${data.transcript.text}`]);
			}
		};

		return () => {
			socketRef.current?.send(JSON.stringify({ type: 'stop' }));
			socketRef.current?.close();
		};
	}, []);

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
		mediaRecorderRef.current = recorder;

		recorder.ondataavailable = async (e) => {
			if (e.data.size > 0 && socketRef.current?.readyState === WebSocket.OPEN) {
				const buffer = await e.data.arrayBuffer();
				const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
				socketRef.current.send(JSON.stringify({ type: 'audio_input', data: base64 }));
			}
		};

		recorder.start(500); // send every 500ms
	};

	const stopRecording = () => {
		mediaRecorderRef.current?.stop();
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-4">🧠 Voice Therapist</h2>
			<button onClick={startRecording} className="px-4 py-2 bg-green-500 text-white rounded mr-2">
				Start Talking
			</button>
			<button onClick={stopRecording} className="px-4 py-2 bg-red-500 text-white rounded">
				Stop
			</button>

			<div className="mt-6 space-y-2">
				{messages.map((msg, i) => (
					<div key={i} className="bg-white/80 p-3 rounded shadow">
						{msg}
					</div>
				))}
			</div>
		</div>
	);
}
