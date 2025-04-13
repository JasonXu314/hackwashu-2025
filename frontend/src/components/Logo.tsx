import { Cat } from 'lucide-react';

const Logo = () => {
	return (
		<div className="flex items-center gap-2 absolute top-5 left-5">
			<Cat color="#00C5CA" size={36} strokeWidth={3} />
			<p className="font-fredoka font-semibold text-primary text-4xl">therapeutIQ</p>
		</div>
	);
};

export default Logo;
