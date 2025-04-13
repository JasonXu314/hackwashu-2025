import React from 'react';
import AnimalCard from "@/components/AnimalCard"

const Choose = () => {
    return (
        <>
            <AnimalCard animalType='cat'></AnimalCard>
            <AnimalCard animalType='bee'></AnimalCard>
            <AnimalCard animalType='frog'></AnimalCard>
        </>
    );
}

export default Choose;