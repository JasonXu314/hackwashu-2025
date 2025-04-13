import Logo from '@/components/Logo';
import Link from 'next/link';

const Home = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-full text-center">
			<Logo />
			<div className='w-1/2 flex flex-col gap-8 items-center justify-center'>
				<p className="text-7xl text-darkgray font-bold">
					Talk to someone who <span className="text-primary">truly</span> listens
				</p>
				<p className="text-[#686868] text-xl">
					An emotionally intelligent AI therapist that understands your tone, not just your words. Built with real-time emotion sensing from your
					voice.
				</p>
                <Link className='bg-primary py-4 px-12 w-fit text-white rounded-full font-bold text-xl hover:bg-primaryhover' href="chat">Start chatting</Link>
			</div>
		</div>
	);
};

export default Home;
