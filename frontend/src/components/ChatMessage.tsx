interface Props {
	message: string;
	who: 'Cat' | 'User';
}

const ChatMessage = ({ message, who }: Props) => {
	return (
		<div className="flex gap-5">
			<img src="cat-pfp.svg" className="w-12 h-12 rounded-full bg-neutral-300"></img>
			<div className="flex flex-col">
				<div className="flex gap-3 items-center">
					<p className="font-bold text-lg">{who == 'User' ? 'Me' : 'TheraPuss'}</p>
					<p className="text-[#666666] font-medium">5:00pm</p>
				</div>
                <div className="">
                    {message}
                </div>
			</div>
		</div>
	);
};

export default ChatMessage;
