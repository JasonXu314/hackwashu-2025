import Logo from '@/components/Logo';
import Link from 'next/link';

const Home = () => {
	return (
		<div className="relative flex flex-col items-center justify-center h-screen w-full text-center overflow-hidden z-[2] bg-neutral-900">
			<video
				src="background-cat.mp4"
				loop
				autoPlay
				muted
				playsInline
				className="absolute top-0 left-0 w-full h-full object-cover z-[1] opacity-30"
			></video>
			<Logo mode="light"/>
			<div className='w-1/2 flex flex-col gap-8 items-center justify-center z-10'>
				<p className="text-7xl text-white font-bold">
					Talk to someone who <span className="text-primary">truly</span> listens
				</p>
				<p className="text-neutral-200 text-xl">
				Mindcraft blends <span className='text-[#CD5AFF]'>well-being</span> with Minecraft, letting users talk to AI-powered roles — like a therapist, friend, or coach — each reimagined
					as a unique, mob-themed character.
				</p>
				<Link className='bg-primary py-4 px-12 w-fit text-white rounded-xl font-semibold text-xl hover:bg-primaryhover' href="choose">
					Start Chatting
				</Link>
			</div>
		</div>
	);
};

export default Home;
