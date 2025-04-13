import React, { useRef, useEffect, useState, ReactNode } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface ThreeSceneProps {
  children?: ReactNode;
}

const loader = new GLTFLoader();

const ThreeScene: React.FC<ThreeSceneProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

	const mixerRef = useRef<THREE.AnimationMixer | null>(null);
	const actionRef = useRef<THREE.AnimationAction | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(15, containerRef.current.clientWidth / containerRef.current.clientHeight, 1, 1000);
		camera.position.z = 5;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

    const controls = new OrbitControls( camera, renderer.domElement );
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
		containerRef.current.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight("#e6f2fd", 3);
    const light2 = new THREE.DirectionalLight("#e6f2fd", 3);
    const ambientLight = new THREE.AmbientLight("#e6f2fd", 1)
		light.position.set(-5, 5, 5);
    light2.position.set(5, 5, 5);
		scene.add(light, light2, ambientLight);

		const clock = new THREE.Clock();

		loader.load(
			'Calico_Sit.glb',
			(gltf) => {
				scene.add(gltf.scene);
				gltf.scene.rotation.y = Math.PI + 0.3;
				gltf.scene.rotation.x = 0.2;
				gltf.scene.position.y = -0.7;
				gltf.scene.position.x = -0.05;

				if (gltf.animations.length > 0) {
					const mixer = new THREE.AnimationMixer(gltf.scene);
					mixerRef.current = mixer;

					const clip = THREE.AnimationClip.findByName(gltf.animations, 'talking') || gltf.animations[0];
					const action = mixer.clipAction(clip);
					action.clampWhenFinished = true;
					action.loop = THREE.LoopRepeat;
					actionRef.current = action;

					if (isPlaying) {
						action.play();
					}
				}

				animate();
			},
			undefined,
			(error) => {
				console.error('An error occurred loading the model:', error);
			}
		);

		const animate = () => {
			requestAnimationFrame(animate);
			const delta = clock.getDelta();
      controls.update();
			mixerRef.current?.update(delta);
			renderer.render(scene, camera);
		};

		return () => {
			renderer.dispose();
			if (containerRef.current && renderer.domElement.parentNode) {
				containerRef.current.removeChild(renderer.domElement);
			}
		};
	}, []);

	const talk = () => {
		if (isPlaying) {
			actionRef.current?.stop();
		} else {
			actionRef.current?.play();
		}
		setIsPlaying(!isPlaying);
	};

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full bg-neutral-200 rounded-3xl relative"
      >
        <button onClick={ talk }>test</button>
        {/* Render children as an overlay */}
        {children && (
          <div className="">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default ThreeScene;
