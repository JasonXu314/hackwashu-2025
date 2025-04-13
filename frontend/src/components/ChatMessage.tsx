interface Props {
	message: string;
	who: 'Cat' | 'User';
}

const ChatMessage = ({ message, who }: Props) => {
	return (
		<div className="flex gap-3 w-full px-2 sm:px-4">
			{/* Avatar */}
			<img
				src={who === 'User' ? 'steve.png' : 'cat-pfp.svg'}
				className="w-12 h-12 bg-neutral-300 shrink-0 rounded-full"
				alt={`${who} avatar`}
			/>

			{/* Message Block */}
			<div className="flex flex-col flex-1 min-w-0">
				<div className="flex gap-3 items-center">
					<p className="font-bold text-lg">{who === 'User' ? 'You' : 'TheraPuss'}</p>
					<p className="text-[#666666] font-medium text-sm">5:00pm</p>
				</div>

				<div className="whitespace-pre-wrap break-words text-base text-gray-800 bg-gray-100 rounded-lg px-4 py-2">
					{message}
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
