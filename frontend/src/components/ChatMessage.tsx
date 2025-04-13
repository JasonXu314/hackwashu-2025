export interface Message {
	messages: string[];
	author: 'cat' | 'user';
	time: Date;
}

const ChatMessage = ({ messages, author, time }: Message) => {
	return (
		<div className="flex gap-3 w-full px-2 sm:px-4">
			{/* Avatar */}
			<img src={author === 'user' ? 'steve.png' : 'cat-pfp.svg'} className="w-12 h-12 bg-neutral-300 shrink-0 rounded-full" alt={`${author} avatar`} />

			{/* Message Block */}
			<div className="flex flex-col flex-1 min-w-0">
				<div className="flex gap-3 items-center">
					<p className="font-bold text-lg">{author === 'user' ? 'You' : 'TheraPuss'}</p>
					<p className="text-[#666666] font-medium text-sm">5:00pm</p>
				</div>
				<div className="flex flex-col gap-1">
					{messages.map((message, index) => (
						<div className="whitespace-pre-wrap break-words text-base text-gray-800 bg-gray-100 rounded-lg px-4 py-2">{message}</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
