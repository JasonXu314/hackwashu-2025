import { Cat } from 'lucide-react';
import Link from 'next/link';

const Logo = ({ mode } : {mode: string}) => {
	return (
		<Link className="flex items-center gap-2 absolute top-5 left-5 z-[1]" href="/">
			<img src="totem.svg"></img>
			<p className={`font-fredoka font-semibold ${mode == 'dark' ? 'text-darkgray' : 'text-white'} text-4xl mb-[4px]`}>mindcraft</p>
		</Link>
	);
};

export default Logo;
