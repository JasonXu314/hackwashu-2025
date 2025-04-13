import { Cat } from 'lucide-react';
import Link from 'next/link';

const Logo = () => {
	return (
		<div className="flex items-center gap-2 absolute top-5 left-5 z-[1]">
			<img src="totem.svg"></img>
			<p className="font-fredoka font-semibold text-white text-4xl mb-[4px]">mindcraft</p>
		</div>
	);
};

export default Logo;
