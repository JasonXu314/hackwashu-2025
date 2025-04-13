import Logo from '@/components/Logo';
import Link from 'next/link';

const Home = () => {
	return (
		<div className="relative flex flex-col items-center justify-center h-screen w-full text-center overflow-hidden z-[2] bg-neutral-900">
			<video
				src="background.mp4"
				loop
				autoPlay
				muted
				playsInline
				className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-45"
			></video>
			<Logo />
			<div className='w-1/2 flex flex-col gap-8 items-center justify-center z-10'>
				<p className="text-7xl text-white font-bold">
					Talk to someone who <span className="text-primary">truly</span> listens
				</p>
				<p className="text-neutral-200 text-xl">
					An emotionally intelligent AI therapist that understands your tone, not just your words. Built with real-time emotion sensing from your
					voice.
				</p>
				<Link className='bg-primary py-4 px-12 w-fit text-white rounded-full font-bold text-xl hover:bg-primaryhover' href="chat">
					Start chatting
				</Link>
			</div>
		</div>
	);
};

export default Home;
