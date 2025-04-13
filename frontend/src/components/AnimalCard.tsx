import React from 'react';
import { motion } from "motion/react"

interface AnimalDetails {
	title: string;
	imageSrc: string;
	altText: string;
	description: string;
}

type AnimalType = 'cat' | 'bee' | 'frog';

interface Props {
	animalType: AnimalType | string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
    selected: string;
}

const animalData: Record<AnimalType | 'default', AnimalDetails> = {
	cat: {
		title: 'Meowtivator',
		imageSrc: '/cat-pfp.svg',
		altText: 'Cute Cat',
		description: 'Purrfectly motivating, one meow at a time.',
	},
	bee: {
		title: 'Therabee',
		imageSrc: '/bee.jpg',
		altText: 'Busy Bee',
		description: 'Buzzing with positivity and sweet encouragement.',
	},
	frog: {
		title: 'Froglosopher',
		imageSrc: '/frog.png',
		altText: 'Happy Frog',
		description: 'Leap into action with some ribbiting advice!',
	},
	default: {
		title: 'Meowtivator',
		imageSrc: '/cat-pfp.svg',
		altText: 'Cute Cat',
		description: 'Purrfectly motivating, one meow at a time.',
	},
};

const AnimalCard: React.FC<Props> = ({ animalType, setSelected, selected }) => {
	const data = animalData.hasOwnProperty(animalType) && animalType !== 'default' ? animalData[animalType as AnimalType] : animalData.default;

    if (selected == animalType) {
        return (
            <div
                className="bg-neutral-900 border border-primary w-56 p-5 rounded-lg flex flex-col items-center gap-3 transition-all duration-200 hover:bg-neutral-800 cursor-pointer"
                onClick={() => setSelected(animalType)}
            >
                <div className="text-white text-lg font-medium">{data.title}</div>
                <img src={data.imageSrc} alt={data.altText} className="w-20 h-20 rounded-md object-cover my-2" />
                <div className="text-neutral-400 text-xs text-center">{data.description}</div>
            </div>
        );
    }

	return (
		<motion.div
			animate={{
				y: [36, 0],
				opacity: [0, 1],
				transition: { duration: 0.5 },
			}}
			className="bg-neutral-900 border border-neutral-700 w-56 p-5 rounded-lg flex flex-col items-center gap-3 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer"
			onClick={() => setSelected(animalType)}
		>
			<div className="text-white text-lg font-medium">{data.title}</div>
			<img src={data.imageSrc} alt={data.altText} className="w-20 h-20 rounded-md object-cover my-2" />
			<div className="text-neutral-400 text-xs text-center">{data.description}</div>
		</motion.div>
	);
};

export default AnimalCard;
