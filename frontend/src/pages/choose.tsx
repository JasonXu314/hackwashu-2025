import React from 'react';

const Choose = () => {
    return (
        <>
            <div className="bg-neutral-900 border border-neutral-700 w-56 p-5 rounded-lg flex flex-col items-center gap-3 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer">
                <div className="text-white text-lg font-medium">
                    Meowtivator
                </div>
                <img
                    src="cat-pfp.svg"
                    alt="Frog"
                    className="w-20 h-20 rounded-md object-cover my-2"/>
                <div className="text-neutral-400 text-xs text-center">
                    Meow meow meow
                </div>
            </div>
            <div className="bg-neutral-900 border border-neutral-700 w-56 p-5 rounded-lg flex flex-col items-center gap-3 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer">
                <div className="text-white text-lg font-medium">
                    Bee
                </div>
                <img
                    src="bee.jpg"
                    alt="Frog"
                    className="w-20 h-20 rounded-md object-cover my-2"/>
                <div className="text-neutral-400 text-xs text-center">
                    Bzzzzzzzzzzzz
                </div>
            </div>
            <div className="bg-neutral-900 border border-neutral-700 w-56 p-5 rounded-lg flex flex-col items-center gap-3 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer">
                <div className="text-white text-lg font-medium">
                    Fralosopher
                </div>
                <img
                    src="frog.png"
                    alt="Frog"
                    className="w-20 h-20 rounded-md object-cover my-2"/>
                <div className="text-neutral-400 text-xs text-center">
                    Frogggy frog frog froggity frog
                </div>
            </div>
        </>
    );
}

export default Choose;