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
	const [currentMessage, setCurrentMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [chatPlaying, setChatPlaying] = useState(false);
	const [id, setId] = useState('');
	const ref = useRef<WebSocket | null>(null);
    const anchorRef = useRef<null | HTMLDivElement>(null);

	// '/begin' - post for an id
	// '/prompt' - id and msg

	useEffect(() => {
		api.post('/begin')
			.then((res) => {
				setId(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

	const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

    const scrollToBottom = async () => {
        anchorRef.current?.scrollIntoView({ behavior: 'auto' });
        // if (messageInit) {
        //     setTimeout(() => {
        //         setMessageInit(false);
        //     }, 500);
        // }
    };

	const sendMessage = () => {
		if (currentMessage.trim() === '') return;

		const userMessage = currentMessage.trim();
		setCurrentMessage('');

		// Create a shallow copy to avoid direct state mutation
		let updatedMessages = [...chatMessages];

		// Append user message to last user thread or create new
		if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].author === 'user') {
			updatedMessages = updatedMessages.map((msg, index) =>
				index === updatedMessages.length - 1
					? {
							...msg,
							messages: [...msg.messages, userMessage],
					  }
					: msg
			);
		} else {
			updatedMessages.push({
				author: 'user',
				messages: [userMessage],
				time: new Date(),
			});
		}

		setChatMessages(updatedMessages);

		// Send to API
		api.post('/prompt', {
			id: id,
			msg: userMessage,
		})
			.then((res) => {
				const aiResponse = res.data;

				// Append AI response to last AI thread or create new
				setChatMessages((prev) => {
					const newMessages = [...prev];
					if (newMessages.length > 0 && newMessages[newMessages.length - 1].author === 'cat') {
						newMessages[newMessages.length - 1] = {
							...newMessages[newMessages.length - 1],
							messages: [...newMessages[newMessages.length - 1].messages, aiResponse],
						};
					} else {
						newMessages.push({
							author: 'cat',
							messages: [aiResponse],
							time: new Date(),
						});
					}
					return newMessages;
				});
			})
			.catch((err) => {
				console.error(err);
			});
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

					if (!muted) {
						try {
							ws.send(toB64(buf));
						} catch {
							node.port.onmessage = null;
							ctx.close();
						}
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
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-row">
			<Logo mode="light" />
			<div className="w-3/4 flex flex-col p-8 pt-24 gap-8 relative">
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
								setSessionStarted(false);
								if (ref.current) {
									ref.current.close();
									ref.current = null;
								}
							}}
						>
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
			<div className="bg-neutral-900 w-1/4 flex flex-col">
				<p className="text-center border-b-2 p-4 font-bold text-lg text-white border-neutral-600">Session Chat</p>
				<div className="py-6 flex flex-col px-2 overflow-y-scroll overflow-x-hidden gap-3 w-full">
					{chatMessages.map((message, index) => (
						<ChatMessage key={index} messages={message.messages} author={message.author} time={message.time} />
					))}
                    <div ref={anchorRef} />
				</div>
				<div className="w-full border-t-2 mt-auto flex items-center border-neutral-600">
					<TextareaAutosize
						className="p-5 rounded-[5px] w-full outline-none border-none resize-none bg-darkgray text-white text-sm"
						minRows={1}
						maxRows={10}
						placeholder="Enter message..."
						onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => onKeyDownHandler(e)}
						onChange={(e) => setCurrentMessage(e.target.value)}
						maxLength={2000}
						value={currentMessage}
					/>
				</div>
			</div>
		</div>
	);
}
