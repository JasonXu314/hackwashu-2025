import Scene from '../components/CatScene';

export default function Page() {
    return (
        <>
            <div className='bg-white w-screen h-screen flex flex-row gap-8'>
                <div className='basis-2/3 flex flex-col gap-8 pl-16 py-16'>
                    <Scene>
                        <div className="bg-neutral-300 top-8 right-8 w-40 h-20 rounded-3xl p-16 absolute z-[99]">YOU</div>
                    </Scene>
                    <div className="flex flex-row justify-center gap-16">
                        <button className="p-6 bg-red-500 rounded-md">End Session</button>
                        <button className="p-6 rounded-full bg-neutral-300">End</button>
                    </div>
                </div>
                <div className='bg-neutral-300 basis-1/3'>CHATTY</div>
            </div>
        </>
    );
  }
  