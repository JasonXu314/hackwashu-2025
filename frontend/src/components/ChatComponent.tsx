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

export default function ChatCompoennt() {
	const [muted, setMuted] = useState(false);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [chatPlaying, setChatPlaying] = useState(false);
	const [id, setId] = useState('');
	const anchorRef = useRef<null | HTMLDivElement>(null);

	const { connect, disconnect, readyState, isPlaying, messages, sendUserInput, mute, unmute } = useVoice();

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
	}, [messages]);

	useEffect(() => {
		if (isPlaying) {
			setChatPlaying(true);
		} else {
			setChatPlaying(false);
		}
	}, [isPlaying]);

	const onKeyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			// sendMessage();
			sendUserInput(currentMessage);
            setCurrentMessage('')
		}
	};

	const scrollToBottom = async () => {
		anchorRef.current?.scrollIntoView({ behavior: 'auto' });
	};

	// const sendMessage = () => {
	// 	if (currentMessage.trim() === '') return;

	// 	const userMessage = currentMessage.trim();
	// 	setCurrentMessage('');

	// 	let updatedMessages = [...chatMessages];

	// 	if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].author === 'user') {
	// 		updatedMessages = updatedMessages.map((msg, index) =>
	// 			index === updatedMessages.length - 1
	// 				? {
	// 						...msg,
	// 						messages: [...msg.messages, userMessage],
	// 				  }
	// 				: msg
	// 		);
	// 	} else {
	// 		updatedMessages.push({
	// 			author: 'user',
	// 			messages: [userMessage],
	// 			time: new Date(),
	// 		});
	// 	}

	// 	setChatMessages(updatedMessages);

	// 	api.post('/prompt', {
	// 		id: id,
	// 		msg: userMessage,
	// 	})
	// 		.then((res) => {
	// 			const aiResponse = res.data;
	// 			setChatMessages((prev) => {
	// 				const newMessages = [...prev];
	// 				if (newMessages.length > 0 && newMessages[newMessages.length - 1].author === 'cat') {
	// 					newMessages[newMessages.length - 1] = {
	// 						...newMessages[newMessages.length - 1],
	// 						messages: [...newMessages[newMessages.length - 1].messages, aiResponse],
	// 					};
	// 				} else {
	// 					newMessages.push({
	// 						author: 'cat',
	// 						messages: [aiResponse],
	// 						time: new Date(),
	// 					});
	// 				}
	// 				return newMessages;
	// 			});
	// 		})
	// 		.catch((err) => {
	// 			console.error(err);
	// 		});
	// };

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-row">
			<Logo mode="light" />
			<div className="w-3/4 flex flex-col p-8 pt-24 gap-8 relative">
				<Scene playing={chatPlaying}>
					<div className="absolute -top-8 -right-4 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex flex-row justify-center items-center gap-6">
					{sessionStarted && readyState === VoiceReadyState.OPEN ? (
						<button
							className="px-16 py-5 rounded-md bg-red-500 text-white flex gap-3 hover:bg-red-600"
							onClick={() => {
								setSessionStarted(false);
								disconnect();
							}}
						>
							<LogOut />
							End Session
						</button>
					) : (
						<button
							className="px-16 py-5 rounded-md bg-primary text-white flex gap-3 hover:bg-primaryhover"
							onClick={() => {
								connect()
									.then(() => {
										setSessionStarted(true);
									})
									.catch((err) => {
										console.log(err);
									});
							}}
						>
							<PhoneCall />
							Start Session
						</button>
					)}
					<button
						className="p-5 rounded-full bg-neutral-100 hover:bg-neutral-300"
						onClick={() => {
							if (muted) {
								unmute();
							} else {
								mute();
							}
							setMuted(!muted);
						}}
					>
						{muted ? <MicOff /> : <Mic />}
					</button>
				</div>
			</div>
			<div className="bg-neutral-900 w-1/4 flex flex-col">
				<p className="text-center border-b-2 p-4 font-bold text-lg text-white border-neutral-600">Session Chat</p>
				<div className="py-6 flex flex-col px-2 overflow-y-scroll overflow-x-hidden gap-3 w-full">
					{messages.map((msg, index) => {
						if (msg.type === 'user_message' || msg.type === 'assistant_message') {
							return (
								<ChatMessage
									key={index}
									message={msg.message.content!}
									author={msg.type == 'user_message' ? 'user' : 'cat'}
									time={msg.receivedAt}
								/>
							);
						}
					})}
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
                        disabled={!sessionStarted || readyState !== VoiceReadyState.OPEN}
					/>
				</div>
			</div>
		</div>
	);
}
