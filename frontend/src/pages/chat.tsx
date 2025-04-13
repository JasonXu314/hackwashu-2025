// ./pages/index.tsx

import { fetchAccessToken } from 'hume';
import { InferGetServerSidePropsType } from 'next';
import { VoiceProvider } from '@humeai/voice-react';
import { useVoice, VoiceReadyState } from '@humeai/voice-react';
import ChatCompoennt from '@/components/ChatComponent';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
    const router = useRouter();
    const { selected } = router.query;

    const [configId, setConfigId] = useState('60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161');

	return (
		<>
			<audio src="background.mp3" loop autoPlay></audio>
			<VoiceProvider auth={{ type: 'accessToken', value: accessToken }} configId={configId}>
				<ChatCompoennt selected={selected} setConfigId={setConfigId}/>
			</VoiceProvider>
		</>
	);
}
