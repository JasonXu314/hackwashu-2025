import Logo from '@/components/Logo';
import Link from 'next/link';
import { useState } from 'react';

const Choose = () => {
	const [selected, setSelected] = useState<string>('');

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-row justify-center items-center gap-5">
			<Logo mode="light" />
			<Link
				href={{ pathname: '/chat', query: { selected } }}
				className="items-center px-12 py-4 text-lg font-medium rounded-xl bg-primary text-white flex gap-3 hover:bg-primaryhover"
			>
				Choose
			</Link>
		</div>
	);
};

export default Choose;
