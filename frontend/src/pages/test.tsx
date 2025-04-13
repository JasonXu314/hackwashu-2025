import Scene from '../components/CatScene';

export default function Page() {
    return (
        <>
            <div className='bg-white w-screen h-screen p-16 flex flex-col gap-16'>
                <Scene>
                <div className="bg-neutral-200 w-fit h-fit rounded-3xl p-16">YOU</div>
                </Scene>
            </div>
        </>
    );
  }
  