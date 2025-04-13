// ./pages/index.tsx
import Scene from '@/components/CatScene';
import ChatMessage, { Message } from '@/components/ChatMessage';
import Logo from '@/components/Logo';
import UserCamera from '@/components/UserCamera';
import api from '@/lib/axiosConfig';
import { GeminiProcessor } from '@/lib/GeminiProcessor';
import { toB64, toF32Audio } from '@/lib/utils';
import { TextareaAutosize } from '@mui/material';
import { fetchAccessToken } from 'hume';
import { LogOut, Mic, MicOff, PhoneCall } from 'lucide-react';
import { InferGetServerSidePropsType } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { VoiceProvider } from '@humeai/voice-react';
import { useVoice, VoiceReadyState } from '@humeai/voice-react';
import ChatCompoennt from '@/components/ChatComponent';

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

export default function Page({ accessToken }: PageProps) {
	return (
		<VoiceProvider auth={{ type: 'accessToken', value: accessToken }} configId="60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161">
			<ChatCompoennt/>
		</VoiceProvider>
	);
}
