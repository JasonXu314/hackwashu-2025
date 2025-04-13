// ./pages/index.tsx
import Controls from '@/components/Controls';
import Messages from '@/components/Messages';
import { fetchAccessToken } from 'hume';
import { VoiceProvider } from '@humeai/voice-react';
import { InferGetServerSidePropsType } from 'next';
import Logo from '@/components/Logo';
import Scene from '@/components/CatScene';
import ChatMessage from '@/components/ChatMessage';
import UserCamera from '@/components/UserCamera';
import { LogOut, Mic, Send, MicOff, PhoneCall } from 'lucide-react';
import { useState } from 'react';

export const getServerSideProps = async () => {
	const accessToken = await fetchAccessToken({
		apiKey: String(process.env.HUME_API_KEY),
		secretKey: String(process.env.HUME_SECRET_KEY),
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
	const [muted, setMuted] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);

	return (
		// <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
		// 	<Messages />
		// 	<Controls />
		// </VoiceProvider>
		<div className="bg-gradient-to-r from-white via-white via-30% to-[#B4F7F8] h-screen flex flex-row">
			<Logo />
			<div className="w-3/4 flex flex-col p-8 pt-24 gap-8">
				<Scene>
					<div className="absolute -top-8 -right-4 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex flex-row justify-center items-center gap-6">
					{sessionStarted ? <button className="px-16 py-5 rounded-md bg-red-500 text-white flex gap-3 hover:bg-red-600">
						<LogOut />
						End Session
					</button> : <button className="px-16 py-5 rounded-md bg-primary text-white flex gap-3 hover:bg-primaryhover">
						<PhoneCall />
						Start Session
					</button>}
					<button className="p-5 rounded-full bg-neutral-300 hover:bg-neutral-400" onClick={() => setMuted(!muted)}>
						{muted ? <MicOff /> : <Mic />}
					</button>
                    {/* <button
						className="p-5 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-md border border-white/20 shadow-sm transition duration-200"
						onClick={() => setMuted(!muted)}
					>
						{muted ? <MicOff /> : <Mic />}
					</button> */}
				</div>
			</div>
			<div className="bg-white w-1/4 flex flex-col gap-6">
				<p className="text-center border-b-2 p-6 font-bold text-xl">Session Chat</p>
				<div className="flex flex-col px-2 overflow-y-scroll overflow-x-hidden gap-3 w-full">
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="Cat" />
				</div>
				<div className="w-full border-t-2 mt-auto flex items-center">
					<input className="w-full h-full p-6 outline-none" placeholder="Enter message..."></input>
					<Send className="text-primary absolute right-0 mx-6 hover:cursor-pointer hover:text-primaryhover" size={32} />
				</div>
			</div>
		</div>
	);
}
