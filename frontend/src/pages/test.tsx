import Scene from '../components/CatScene';

export default function Page() {
    return (
        <>
            <div className='bg-white w-screen h-screen p-16 flex flex-row gap-16'>
                <div className='basis-2/3 flex flex-col'>
                    <Scene>
                        <div className="bg-neutral-300 top-16 right-16 w-20 h-20 rounded-3xl p-16 absolute z-[99]">YOU</div>
                    </Scene>
                    <div className="flex flex-row justify-center gap-16 h-full">
                        <button className="p-8 bg-red-500 rounded-md">End Session</button>
                        <button className="p-8 rounded-full bg-neutral-300">End</button>
                    </div>
                </div>
                <div className='bg-neutral-300 basis-1/3'>
                    
                </div>
            </div>
        </>
    );
  }
  