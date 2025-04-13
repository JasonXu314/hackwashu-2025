import Scene from '../components/CatScene';

export default function Page() {
    return (
        <>
            <div className='bg-white w-screen h-screen p-16 flex flex-row gap-16'>
                <Scene>
                    <div className="bg-neutral-300 top-16 right-16 w-20 h-20 rounded-3xl p-16 absolute">YOU</div>
                </Scene>
                <div></div>
            </div>
        </>
    );
  }
  