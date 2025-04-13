// ./pages/index.tsx
import Controls from '@/components/Controls';
import Messages from '@/components/Messages';
import { fetchAccessToken } from 'hume';
import { VoiceProvider } from '@humeai/voice-react';
import { InferGetServerSidePropsType } from 'next';
import Logo from '@/components/Logo';
import Scene from '@/components/CatScene';
import ChatMessage from '@/components/ChatMessage';
import { Send } from 'lucide-react';
import UserCamera from '@/components/UserCamera';

export const getServerSideProps = async () => {
	const accessToken = await fetchAccessToken({
		apiKey: String(process.env.HUME_API_KEY),
		secretKey: String(process.env.HUME_SECRET_KEY),
	});

	return {
		props: {
			accessToken,
		},
	};
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Page({ accessToken }: PageProps) {
	return (
		// <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
		// 	<Messages />
		// 	<Controls />
		// </VoiceProvider>
		<div className="bg-white w-screen h-screen flex flex-row gap-8">
			<Logo />
			<div className="basis-2/3 flex flex-col gap-8 pl-16 py-16 relative">
				<Scene>
					<div className="absolute top-8 right-8 z-[99]">
						<UserCamera />
					</div>
					<div className="bg-neutral-300 w-40 h-20 rounded-3xl p-16 absolute z-[90] top-8 right-8">
						YOU
					</div>
				</Scene>
				<div className="flex flex-row justify-center gap-16">
					<button className="p-6 bg-red-500 rounded-md">End Session</button>
					<button className="p-6 rounded-full bg-neutral-300">End</button>
				</div>
			</div>
			<div className="bg-white basis-1/3 flex flex-col gap-6">
				<p className="text-center border-b-2 p-6 font-bold text-xl">Session Chat</p>
				<div className="flex flex-col px-6 overflow-y-scroll gap-3">
					<ChatMessage message="This is a test message from the user." who="User" />
					<ChatMessage message="Here's a response from the system." who="System" />
				</div>
				<div className="w-full border-t-2 mt-auto flex items-center">
					<input className="w-full h-full p-6 outline-none" placeholder="Enter message..." />
					<Send className="text-primary absolute right-0 mx-6 hover:cursor-pointer hover:text-primaryhover" size={32} />
				</div>
			</div>
		</div>
	);
}