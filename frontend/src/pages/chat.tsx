// ./pages/index.tsx
import Controls from '@/components/Controls';
import Messages from '@/components/Messages';
import { fetchAccessToken } from 'hume';
import { VoiceProvider } from '@humeai/voice-react';
import { InferGetServerSidePropsType } from 'next';
import Logo from '@/components/Logo';
import Scene from '@/components/CatScene';

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
		<div className="bg-gradient-to-br from-white to-[#B4F7F8] h-screen p-16 flex flex-row gap-16">
			<Logo />
			<div className="basis-2/3 flex flex-col">
				<Scene>
					<div className="bg-neutral-300 top-16 right-16 w-20 h-20 rounded-3xl p-16 absolute z-[99]">YOU</div>
				</Scene>
				<div className="flex flex-row justify-center gap-16">
					<button className="p-8 bg-red-500 rounded-md">End Session</button>
					<button className="p-8 rounded-full bg-neutral-300">End</button>
				</div>
			</div>
			<div className="bg-neutral-300 basis-1/3"></div>
		</div>
	);
}
