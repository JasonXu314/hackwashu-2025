import Logo from '@/components/Logo';
import Link from 'next/link';
import { useState } from 'react';
import AnimalCard from '@/components/AnimalCard';

const Choose = () => {
	const [selected, setSelected] = useState<string>('');

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-col justify-center items-center gap-8">
			<Logo mode="light" />
			<div className="flex flex-row justify-center items-center gap-5">
				<AnimalCard animalType="cat"></AnimalCard>
				<AnimalCard animalType="bee"></AnimalCard>
				<AnimalCard animalType="frog"></AnimalCard>
			</div>
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
