// ./pages/index.tsx
import Scene from '@/components/CatScene';
import ChatMessage, { Message } from '@/components/ChatMessage';
import Logo from '@/components/Logo';
import UserCamera from '@/components/UserCamera';
import { GeminiProcessor } from '@/lib/GeminiProcessor';
import { toB64, toF32Audio } from '@/lib/utils';
import { TextareaAutosize } from '@mui/material';
import { fetchAccessToken } from 'hume';
import { LogOut, Mic, MicOff, PhoneCall } from 'lucide-react';
import { InferGetServerSidePropsType } from 'next';
import { useCallback, useRef, useState } from 'react';

export const getServerSideProps = async () => {
	const accessToken = await fetchAccessToken({
		apiKey: String(process.env.HUME_API_KEY),
		secretKey: String(process.env.HUME_SECRET_KEY)
	});

	if (!accessToken) {
		return {
			redirect: {
				destination: '/error',
				permanent: false
			}
		};
	}

	return {
		props: {
			accessToken
		}
	};
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Page({ accessToken }: PageProps) {
	const [muted, setMuted] = useState(false);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [chatPlaying, setChatPlaying] = useState(false);
	const ref = useRef<WebSocket | null>(null);

	const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const sendMessage = () => {
		console.log(currentMessage);
		if (currentMessage.trim() == '') {
			return;
		}
		setCurrentMessage('');
		if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].author === 'user') {
			chatMessages[chatMessages.length - 1].messages.push(currentMessage.trim());
			setChatMessages([...chatMessages]);
		} else {
			setChatMessages([...chatMessages, { author: 'user', messages: [currentMessage.trim()], time: new Date() }]);
		}
	};

	const startSession = useCallback(() => {
		setSessionStarted(true);
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(async (stream) => {
				const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
				const ctx = new AudioContext({ sampleRate: 24_000 });
				await ctx.audioWorklet.addModule(GeminiProcessor);
				await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

				ref.current = ws;

				const src = ctx.createMediaStreamSource(stream);

				const node = new AudioWorkletNode(ctx, 'gemini-processor');
				src.connect(node);

				node.port.onmessageerror = (err) => console.error(err);
				node.port.onmessage = (evt) => {
					const buf: ArrayBuffer = evt.data.data;

					try {
						ws.send(toB64(buf));
					} catch {
						node.port.onmessage = null;
					}
				};

				let playing = false;
				setChatPlaying(false);
				const buffer: Float32Array[] = [];

				const flush = async () => {
					playing = true;
					setChatPlaying(true);

					while (buffer.length > 0) {
						const chunk = buffer.shift()!;

						const buf = ctx.createBuffer(1, chunk.length, 24_000);
						buf.copyToChannel(chunk, 0);

						const src = ctx.createBufferSource();
						src.buffer = buf;

						src.connect(ctx.destination);
						src.start(0);

						await new Promise<void>((resolve) =>
							src.addEventListener(
								'ended',
								() => {
									src.disconnect(ctx.destination);
									resolve();
								},
								{ once: true }
							)
						);
					}

					playing = false;
					setChatPlaying(false);
				};

				ws.addEventListener('message', (evt) => {
					const chunk = toF32Audio(evt.data);

					buffer.push(chunk);

					if (!playing) flush();
				});
			})
			.catch((err) => {
				console.error('rejected', err);
			});
	}, []);

	return (
		// <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
		// 	<Messages />
		// 	<Controls />
		// </VoiceProvider>
		<div className="bg-gradient-to-r from-white via-white via-30% to-[#B4F7F8] h-screen flex flex-row">
			<Logo />
			<div className="w-3/4 flex flex-col p-8 pt-24 gap-8">
				<Scene playing={chatPlaying}>
					<div className="absolute -top-8 -right-4 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex flex-row justify-center items-center gap-6">
					{sessionStarted ? (
						<button
							className="px-16 py-5 rounded-md bg-red-500 text-white flex gap-3 hover:bg-red-600"
							onClick={() => {
								if (ref.current) {
									ref.current.close();
									ref.current = null;
								}
							}}>
							<LogOut />
							End Session
						</button>
					) : (
						<button className="px-16 py-5 rounded-md bg-primary text-white flex gap-3 hover:bg-primaryhover" onClick={() => startSession()}>
							<PhoneCall />
							Start Session
						</button>
					)}
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
					{chatMessages.map((message, index) => (
						<ChatMessage key={index} messages={message.messages} author={message.author} time={message.time} />
					))}
					{/* <ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" author="user" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" author="user" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" author="user" />
					<ChatMessage message="blah blah dsadasdas asdassdflasdjldfasjfadjkafdjkfdaskjldfskljfklj" author="cat" /> */}
				</div>
				{/* <form
					className="w-full border-t-2 mt-auto flex items-center"
					onSubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}
				>
					<textarea
						className="w-full h-full p-6 outline-none"
						value={currentMessage}
						onChange={(e) => {
							setCurrentMessage(e.target.value);
						}}
						placeholder="Enter message..."
					></textarea>
					<button
						className="mx-6"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							sendMessage();
						}}
					>
						<Send className="text-primary hover:cursor-pointer hover:text-primaryhover" size={32} />
					</button>
				</form> */}
				<div className="w-full border-t-2 mt-auto flex items-center">
					<TextareaAutosize
						className="p-6 rounded-[5px] w-full outline-none border-none resize-none"
						minRows={1}
						maxRows={10}
						placeholder="Enter message..."
						onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => onKeyDownHandler(e)}
						onChange={(e) => setCurrentMessage(e.target.value)}
						maxLength={2000}
						value={currentMessage}
					/>
					{/* <button
						className="m-4 self-start"
						type="submit"
						onClick={(e) => {
							e.preventDefault();
							sendMessage();
						}}
					>
						<Send className="text-primary hover:cursor-pointer hover:text-primaryhover" size={32} />
					</button> */}
				</div>
			</div>
		</div>
	);
}

