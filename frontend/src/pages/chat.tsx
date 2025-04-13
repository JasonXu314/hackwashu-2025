// ./pages/index.tsx

import { fetchAccessToken } from 'hume';
import { InferGetServerSidePropsType } from 'next';
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
