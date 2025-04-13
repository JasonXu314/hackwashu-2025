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
import { ImPhoneHangUp } from 'react-icons/im';
import SummaryModal from '@/components/SummaryModal';

export default function ChatCompoennt() {
	const [muted, setMuted] = useState(false);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [chatPlaying, setChatPlaying] = useState(false);
	const [id, setId] = useState('');
	const anchorRef = useRef<null | HTMLDivElement>(null);
	const [summary, setSummary] = useState('');
	const [selectedAnimal, setSelectedAnimal] = useState('cat');
	const [isOpen, setIsOpen] = useState(false);
	const [previousMessages, setPreviousMessages] = useState<any[]>([]);

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
			sendUserInput(currentMessage);
			setCurrentMessage('');
		}
	};

	const scrollToBottom = async () => {
		anchorRef.current?.scrollIntoView({ behavior: 'auto' });
	};

	const summarize = () => {
		const filteredMessages = messages
			.filter((msg) => msg.type === 'user_message' || msg.type === 'assistant_message')
			.map((msg) => `${msg.type}: ${msg.message.content}`) // Optional: add author label
			.join('\n');

		api.post('/prompt', {
			id: id,
			msg:
				"I'm providing you conversation data between me (user) and someone else (assistant). Could you summarize our conversation in under 100 words. " +
				filteredMessages,
		})
			.then((res) => {
				setSummary(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-row">
			{isOpen && <SummaryModal summary={summary} onClose={() => setIsOpen(false)} />}
			<Logo mode="light" />
			<div className="w-3/4 flex flex-col p-8 pt-24 gap-8 relative">
				<Scene playing={chatPlaying}>
					<div className="absolute -top-8 -right-4 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex justify-center items-center gap-6">
					<div className="flex gap-2 items-center mr-auto">
						<img
							src="/cat-pfp.svg"
							className={`h-12 w-12 cursor-pointer outline outline-white outline-offset-2 ${
								selectedAnimal === 'cat' ? 'outline-2' : 'outline-0'
							}`}
						/>

						<img src="cat-pfp.svg" className="h-12 w-12"></img>
						<img src="cat-pfp.svg" className="h-12 w-12"></img>
					</div>
					{sessionStarted && readyState === VoiceReadyState.OPEN ? (
						<button
							className="items-center px-12 py-4 rounded-xl bg-red-500 text-white flex gap-3 hover:bg-red-600"
							onClick={() => {
								setPreviousMessages(messages);
								summarize();
								setSessionStarted(false);
								disconnect();
							}}
						>
							<ImPhoneHangUp size={20} />
							End Session
						</button>
					) : (
						<button
							className="items-center px-12 py-4 rounded-xl bg-primary text-white flex gap-3 hover:bg-primaryhover"
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
							<PhoneCall size={20} />
							Start Session
						</button>
					)}
					<button
						className={`p-4 rounded-full mr-auto ${muted ? 'bg-red-500 hover:bg-red-600' : 'bg-neutral-100 hover:bg-neutral-300'}`}
						onClick={() => {
							if (muted) {
								unmute();
							} else {
								mute();
							}
							setMuted(!muted);
						}}
					>
						{muted ? <MicOff color="white" /> : <Mic />}
					</button>
				</div>
			</div>
			<div className="bg-neutral-900 w-1/4 flex flex-col">
				<p className="text-center border-b-2 p-4 font-bold text-lg text-white border-neutral-600">Session Chat</p>
				<div className="py-6 flex flex-col px-2 overflow-y-scroll overflow-x-hidden gap-3 w-full items-center">
					{sessionStarted && readyState === VoiceReadyState.OPEN ? (
						messages.map((msg, index) => {
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
						})
					) : (
						<>
							{previousMessages.map((msg, index) => {
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
							<p className="text-neutral-200 font-medium italic text-center">-- Session has been ended --</p>
							<button className="bg-gradient-to-br to-[#793BFF] from-[#CD5AFF] p-4 px-16 w-fit text-sm text-white font-medium text-center rounded-3xl" onClick={() => setIsOpen(true)}>
								View Summary
							</button>
						</>
					)}
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
