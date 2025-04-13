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
		// <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
		// 	<Messages />
		// 	<Controls />
		// </VoiceProvider>
		<div className="bg-gradient-to-br from-white to-[#B4F7F8] h-screen flex flex-row">
			<Logo />
			<div className="basis-2/3 flex flex-col p-16">
				<Scene>
					<div className="absolute -top-8 -right-8 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex flex-row justify-center gap-16">
					<button className="p-8 bg-red-500 rounded-md">End Session</button>
					<button className="p-8 rounded-full bg-neutral-300">End</button>
				</div>
			</div>
			<div className="bg-white basis-1/3 flex flex-col gap-6">
				<p className="text-center border-b-2 p-6 font-bold text-xl">Session Chat</p>
				<div className="flex flex-col px-6 overflow-y-scroll gap-3">
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" who="User" />
				</div>
				<div className="w-full border-t-2 mt-auto flex items-center">
					<input className="w-full h-full p-6 outline-none" placeholder="Enter message..."></input>
					<Send className="text-primary absolute right-0 mx-6 hover:cursor-pointer hover:text-primaryhover" size={32} />
				</div>
			</div>
		</div>
	);
}
