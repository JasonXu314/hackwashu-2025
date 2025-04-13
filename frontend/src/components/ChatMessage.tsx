import ReactMarkdown from 'react-markdown';

export interface Message {
	message: string;
	author: 'cat' | 'user';
	time: Date;
}

const ChatMessage = ({ message, author, time }: Message) => {
	return (
		<div className="flex gap-3 w-full px-2 sm:px-4">
			{/* Avatar */}
			<img src={author === 'user' ? 'steve.png' : 'cat-pfp.svg'} className="w-10 h-10 bg-neutral-300 shrink-0 rounded-full" alt={`${author} avatar`} />

			{/* Message Block */}
			<div className="flex flex-col flex-1 min-w-0">
				<div className="flex gap-3 items-center">
					<p className="font-bold text-white">{author === 'user' ? 'You' : 'TheraPuss'}</p>
					<p className="text-neutral-400 font-medium text-sm">{time.toLocaleTimeString()}</p>
				</div>
				<div className="flex flex-col gap-1">
					<div className=" bg-neutral-800 rounded-lg px-4 py-2">
						<ReactMarkdown
							components={{
								p: ({ children }) => <p className="text-sm whitespace-pre-wrap break-words text-white">{children}</p>,
								strong: ({ children }) => (
									<strong className="text-sm whitespace-pre-wrap break-wordsfont-semibold text-primary">{children}</strong>
								),
								em: ({ children }) => <em className="text-sm whitespace-pre-wrap break-words text-inherit italic">{children}</em>,
								ul: ({ children }) => <ul className="list-disc list-inside pl-4 space-y-2 text-sm break-words text-white">{children}</ul>,
								li: ({ children }) => <li className="text-sm break-words text-white">{children}</li>,
							}}
						>
							{message}
						</ReactMarkdown>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
