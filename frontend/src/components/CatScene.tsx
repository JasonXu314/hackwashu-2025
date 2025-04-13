import React, { useRef, useEffect, useState, ReactNode } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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
		renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
		containerRef.current.appendChild(renderer.domElement);

		const light = new THREE.DirectionalLight(0xffffff, 5);
		light.position.set(-5, 5, 5);
		scene.add(light);

		const clock = new THREE.Clock();

		loader.load(
			'Calico.glb',
			(gltf) => {
				scene.add(gltf.scene);
				gltf.scene.rotation.y = Math.PI + 0.2;
				gltf.scene.rotation.x = 0.2;
				gltf.scene.position.y = -0.3;
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
        {/* Render children as an overlay */}
        {children && (
          <div className="top-0 left-0 flex items-center justify-center pointer-events-none relative">
            {children}
          </div>
        )}
      </div>
    </>
  );
};

export default ThreeScene;
