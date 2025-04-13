import { Cat } from 'lucide-react';

const Logo = () => {
	return (
		<div className="flex items-center gap-2 absolute top-5 left-5">
			<Cat className='text-primary' size={36} strokeWidth={3} />
			<p className="font-fredoka font-semibold text-darkgray text-4xl mb-[4px]">mindcraft</p>
		</div>
	);
};

export default Logo;
