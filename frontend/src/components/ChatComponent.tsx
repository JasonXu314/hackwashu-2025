import Scene from '@/components/CatScene';
import ChatMessage, { Message } from '@/components/ChatMessage';
import Logo from '@/components/Logo';
import UserCamera from '@/components/UserCamera';
import api from '@/lib/axiosConfig';
import { TextareaAutosize } from '@mui/material';
import { LogOut, Mic, MicOff, PhoneCall } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useVoice, VoiceReadyState } from '@humeai/voice-react';
import { ImPhoneHangUp } from 'react-icons/im';
import SummaryModal from '@/components/SummaryModal';
import { WandSparkles } from 'lucide-react';
import { setConfig } from 'next/config';
import { Loader2 } from 'lucide-react';

const configs = {
	cat: '1186fe63-e191-4e60-8cf8-2a1c59097589',
	bee: '60d82fe3-78f5-4e6c-ae4a-7c7e50fe3161',
	frog: 'a85a190a-05e7-4588-84f9-193d906fddbe',
};

export default function ChatCompoennt({
	selected,
	setConfigId,
}: {
	selected: string | string[] | undefined;
	setConfigId: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [muted, setMuted] = useState(false);
	const [sessionStarted, setSessionStarted] = useState(false);
	const [currentMessage, setCurrentMessage] = useState('');
	const [chatPlaying, setChatPlaying] = useState(false);
	const [id, setId] = useState('');
	const anchorRef = useRef<null | HTMLDivElement>(null);
	const [summary, setSummary] = useState('');
	const [selectedAnimal, setSelectedAnimal] = useState(typeof selected === 'string' ? selected : 'cat');
	const [isOpen, setIsOpen] = useState(false);
	const [previousMessages, setPreviousMessages] = useState<any[]>([]);
	const [previousSelectedAnimal, setPreviousSelectedAnimal] = useState<string>('');
	const [jukePlaying, setJukePlaying] = useState(false);

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

	const handleStartSession = () => {
		connect()
			.then(() => {
				setSessionStarted(true);
				setPreviousSelectedAnimal(selectedAnimal);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleEndSession = () => {
		setPreviousMessages(messages);
		summarize();
		setSessionStarted(false);
		disconnect();
	};

	const isConnecting = readyState === VoiceReadyState.CONNECTING;

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-row">
			{isOpen && <SummaryModal summary={summary} onClose={() => setIsOpen(false)} />}
			<Logo mode="light" />
			<div className="w-3/4 flex flex-col p-8 gap-4 relative">
				<p className="text-4xl text-white text-center font-bold">
					Talk to{' '}
					<span className="text-primary">{selectedAnimal === 'cat' ? 'Meowtivator' : selectedAnimal === 'bee' ? 'Therabee' : 'Froglosopher'}</span>
				</p>
				<Scene playing={chatPlaying} animalType={selectedAnimal}>
					<div className="absolute -top-16 -right-4 h-40 w-auto rounded-2xl">
						<UserCamera />
					</div>
				</Scene>
				<div className="flex justify-between items-center gap-6">
					<div className="flex gap-4 items-center">
						<img
							src="/cat-pfp.svg"
							className={`h-12 w-12 cursor-pointer outline outline-white outline-offset-2 transition-all duration-75 ${
								selectedAnimal === 'cat' ? 'outline-2 opacity-100' : 'outline-0 opacity-20'
							}`}
							onClick={() => {
								if (!isConnecting && !sessionStarted) {
									setSelectedAnimal('cat');
									setConfigId(configs.cat);
								}
							}}
						/>
						<img
							src="bee.jpg"
							className={`h-12 w-12 cursor-pointer outline outline-white outline-offset-2 transition-all duration-75 ${
								selectedAnimal === 'bee' ? 'outline-2 opacity-100' : 'outline-0 opacity-20'
							}`}
							onClick={() => {
								if (!isConnecting && !sessionStarted) {
									setSelectedAnimal('bee');
									setConfigId(configs.bee);
								}
							}}
						/>
						<img
							src="frog.png"
							className={`h-12 w-12 cursor-pointer outline outline-white outline-offset-2 transition-all duration-75 ${
								selectedAnimal === 'frog' ? 'outline-2 opacity-100' : 'outline-0 opacity-20'
							}`}
							onClick={() => {
								if (!isConnecting && !sessionStarted) {
									setSelectedAnimal('frog');
									setConfigId(configs.frog);
								}
							}}
						/>
					</div>
					<img src="jukebox.webp" 
						className={`
							h-14 w-auto hover:scale-95 transition-all duration-75 cursor-pointer z-20
							${jukePlaying ? 'filter-none' : 'grayscale'}
							hover:scale-95
						  `}
						onClick={() => {
							if (jukePlaying) {
								setJukePlaying(false);
							} else {
								setJukePlaying(true);
							}
						  }}
					/>
					<button
						className={`
							p-4 rounded-full ml-auto
							transition-all duration-100 ease-in-out
							${muted ? 'bg-red-500 hover:bg-red-600' : 'bg-neutral-100 hover:bg-neutral-300'}
							hover:scale-95
							disabled:opacity-50
							disabled:cursor-not-allowed
							disabled:scale-100
						  `}
						  onClick={() => {
							if (muted) {
							  unmute();
							} else {
							  mute();
							}
							setMuted(!muted);
						  }}
						disabled={!sessionStarted || readyState !== VoiceReadyState.OPEN}
					>
						{muted ? <MicOff color="white" /> : <Mic />}
					</button>
					{sessionStarted && readyState === VoiceReadyState.OPEN ? (
						<button
							className="items-center px-12 py-4 rounded-xl bg-red-500 text-white font-semibold text-lg flex gap-3 hover:bg-red-600 hover:scale-95 transition-all duration-100"
							onClick={handleEndSession}
						>
							<ImPhoneHangUp size={20} />
							End Session
						</button>
					) : (
						<button
							className="items-center px-12 py-4 rounded-xl bg-primary font-semibold text-lg text-white flex gap-3 hover:bg-primaryhover disabled:opacity-70 disabled:cursor-wait hover:scale-95 transition-all duration-100"
							onClick={handleStartSession}
							disabled={isConnecting}
						>
							{isConnecting ? (
								<>
									<Loader2 size={20} className="animate-spin" />
									Connecting...
								</>
							) : (
								<>
									<PhoneCall size={20} />
									Start Session
								</>
							)}
						</button>
					)}
				</div>
			</div>
			<div className="bg-neutral-900 w-1/4 flex flex-col mc-container">
				<p className="text-center border-b-2 p-4 font-bold text-lg text-white border-neutral-600">Session Chat</p>
				<div className="py-6 flex flex-col px-2 overflow-y-scroll overflow-x-hidden gap-3 w-full items-center">
					{sessionStarted && readyState === VoiceReadyState.OPEN ? (
						messages.map((msg, index) => {
							if (msg.type === 'user_message' || msg.type === 'assistant_message') {
								return (
									<ChatMessage
										key={index}
										message={msg.message.content!}
										author={msg.type == 'user_message' ? 'user' : selectedAnimal}
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
											author={msg.type == 'user_message' ? 'user' : previousSelectedAnimal}
											time={msg.receivedAt}
										/>
									);
								}
							})}
							{previousMessages.length > 4 &&
								!isConnecting && ( // Only show if not connecting
									<>
										<p className="text-neutral-200 font-medium italic text-center">-- Session has been ended --</p>
										<button
											className="bg-gradient-to-br to-[#793BFF] from-[#CD5AFF] p-4 px-12 w-fit text-sm text-white font-medium text-center rounded-3xl flex gap-3 items-center"
											onClick={() => setIsOpen(true)}
										>
											<WandSparkles size={16} />
											Generate Summary
										</button>
									</>
								)}
						</>
					)}
					<div ref={anchorRef} />
				</div>
				{jukePlaying && (
        			<audio src="c418.mp3" loop autoPlay></audio>
      			)}
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
