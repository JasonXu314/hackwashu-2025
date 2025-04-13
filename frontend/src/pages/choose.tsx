import Logo from '@/components/Logo';
import Link from 'next/link';
import { useState } from 'react';
import AnimalCard from '@/components/AnimalCard';
import { FaChevronRight } from "react-icons/fa6";

const Choose = () => {
	const [selected, setSelected] = useState<string>('cat');

	return (
		<div className="bg-gradient-to-br from-darkgray to-[#2A2A2A] h-screen flex flex-col justify-center items-center gap-12">
			<Logo mode="light" />
            <p className='text-white font-bold text-4xl'>Choose your pet</p>
			<div className="flex justify-center items-center gap-5">
				<AnimalCard animalType="cat" setSelected={setSelected} selected={selected}></AnimalCard>
				<AnimalCard animalType="bee" setSelected={setSelected} selected={selected}></AnimalCard>
				<AnimalCard animalType="frog" setSelected={setSelected} selected={selected}></AnimalCard>
			</div>
			<Link
				href={{ pathname: '/chat', query: { selected } }}
				className="items-center pl-12 pr-10 py-4 text-lg font-bold rounded-xl bg-primary text-white flex gap-3 hover:bg-primaryhover"
			>
				NEXT
                <FaChevronRight size={18} />
			</Link>
		</div>
	);
};

export default Choose;
