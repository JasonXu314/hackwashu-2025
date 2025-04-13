import React, { useRef, useEffect, useState, ReactNode } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface ThreeSceneProps {
  children?: ReactNode;
  playing: boolean;
}

const loader = new GLTFLoader();

const ThreeScene: React.FC<ThreeSceneProps> = ({ children, playing }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const requestIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      15,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const light1 = new THREE.DirectionalLight("#e6f2fd", 3);
    const light2 = new THREE.DirectionalLight("#e6f2fd", 3);
    const ambient = new THREE.AmbientLight("#e6f2fd", 1);
    light1.position.set(-5, 5, 5);
    light2.position.set(5, 5, 5);
    scene.add(light1, light2, ambient);

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
          const clip =
            THREE.AnimationClip.findByName(gltf.animations, 'talking') ||
            gltf.animations[0];
          const action = mixer.clipAction(clip);

          action.clampWhenFinished = true;
          action.loop = THREE.LoopRepeat;

          mixerRef.current = mixer;
          actionRef.current = action;

          if (playing) action.play();
        }

        const animate = () => {
          requestIdRef.current = requestAnimationFrame(animate);
          const delta = clock.getDelta();
          controls.update();
          mixerRef.current?.update(delta);
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    return () => {
      if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Toggle animation playback
  useEffect(() => {
    if (playing) {
      actionRef.current?.play();
    } else {
      actionRef.current?.stop();
    }
  }, [playing]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-neutral-200 rounded-3xl relative"
    >
      {children && <div className="absolute top-0 left-0 w-full h-full">{children}</div>}
    </div>
  );
};

export default ThreeScene;
