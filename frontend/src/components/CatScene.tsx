import React, { useRef, useEffect, useState, ReactNode, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

interface ModelConfig {
    path: string;
    rotationY?: number;
    rotationX?: number;
    positionY?: number;
    positionX?: number;
    scale?: number;
    animationName?: string;
}

const animalConfigs: Record<string, ModelConfig> = {
    cat: {
        path: '/Calico.glb',
        rotationY: Math.PI + 0.5,
        rotationX: 0.2,
        positionY: -0.7,
        positionX: 0.1,
        scale: 0.5,
        animationName: 'talking',
    },
	bee: {
        path: '/Bee.glb',
        rotationY: Math.PI + 0.5,
        rotationX: 0.25,
        positionY: -0.1,
        positionX: 0.1,
        scale: 0.5,
        animationName: 'talking',
    },
	frog: {
        path: '/Frog.glb',
        rotationY: Math.PI + 0.5,
        rotationX: 0.2,
        positionY: -0.7,
        positionX: 0.1,
        scale: 0.5,
        animationName: 'talking',
    },
    default: {
        path: '/Calico_Sit.glb',
        rotationY: Math.PI + 0.5,
        rotationX: 0.2,
        positionY: -0.7,
        positionX: 0.1,
        scale: 0.5,
        animationName: 'talking',
    },
};

interface ThreeSceneProps {
    children?: ReactNode;
    playing: boolean;
    animalType: string;
}

const loader = new GLTFLoader();

const ThreeScene: React.FC<ThreeSceneProps> = ({ children, playing, animalType }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionRef = useRef<THREE.AnimationAction | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const requestIdRef = useRef<number>();
    const clockRef = useRef<THREE.Clock>(new THREE.Clock());

    const currentModelConfig = useMemo(() => {
        const typeKey = animalType?.toLowerCase() || 'default';
        return animalConfigs[typeKey] || animalConfigs.default;
    }, [animalType]);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(20, width / height, 1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const light1 = new THREE.DirectionalLight('#e6f2fd', 3);
        const light2 = new THREE.DirectionalLight('#e6f2fd', 3);
        const ambient = new THREE.AmbientLight('#e6f2fd', 1);
        light1.position.set(-5, 5, 5);
        light2.position.set(5, 5, 5);
        scene.add(light1, light2, ambient);

        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        const animate = () => {
            requestIdRef.current = requestAnimationFrame(animate);
            const delta = clockRef.current.getDelta();

            mixerRef.current?.update(delta);

            if (sceneRef.current && cameraRef.current && rendererRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestIdRef.current) cancelAnimationFrame(requestIdRef.current);
            rendererRef.current?.dispose();
            if (containerRef.current && rendererRef.current?.domElement) {
                 try {
                     containerRef.current.removeChild(rendererRef.current.domElement);
                 } catch (e) {
                     console.warn("Could not remove renderer DOM element on cleanup:", e);
                 }
            }
            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            mixerRef.current = null;
            actionRef.current = null;
            modelRef.current = null;
        };
    }, []);

    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        if (modelRef.current) {
            scene.remove(modelRef.current);
        }
        modelRef.current = null;
        if (mixerRef.current) {
            mixerRef.current.stopAllAction();
        }
        mixerRef.current = null;
        actionRef.current = null;

        const config = currentModelConfig;
        if (!config || !config.path) {
            console.error(`No valid config found for animalType: ${animalType}`);
            return;
        }

        let isBee = (animalType?.toLowerCase() === 'bee');

        loader.load(
            config.path,
            (gltf) => {
                if (!sceneRef.current) return;

                const model = gltf.scene;
                modelRef.current = model;
                sceneRef.current.add(model);

                model.rotation.y = config.rotationY ?? 0;
                model.rotation.x = config.rotationX ?? 0;
                model.position.y = config.positionY ?? 0;
                model.position.x = config.positionX ?? 0;
                const scale = config.scale ?? 1;
                model.scale.set(scale, scale, scale);

                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(model);
                    mixerRef.current = mixer;

                    let clipToPlay = gltf.animations[0];
                    if (config.animationName) {
                        const foundClip = THREE.AnimationClip.findByName(gltf.animations, config.animationName);
                        if (foundClip) {
                            clipToPlay = foundClip;
                        } else {
                            console.warn(`Animation clip "${config.animationName}" not found in ${config.path}. Using first available clip: "${clipToPlay.name}".`);
                        }
                    }

                    const action = mixer.clipAction(clipToPlay);
                    actionRef.current = action;
                    action.clampWhenFinished = true;
                    action.loop = THREE.LoopRepeat;

                    if (isBee || playing) {
                        action.play();
                    } else {
                        action.play();
                        if (!isBee) action.paused = true;
                    }

                } else {
                     console.warn(`No animations found in ${config.path}`);
                }
            },
            undefined,
            (error) => {
                console.error(`Error loading model (${config.path}):`, error);
            }
        );

    }, [animalType, currentModelConfig]);


    useEffect(() => {
        if (!actionRef.current) return;

        let isBee = (animalType?.toLowerCase() === 'bee');

        if (playing) {
            actionRef.current.paused = false;
            if (!actionRef.current.isRunning()) {
                 actionRef.current.play();
            }
        } else {
            if (!isBee) {
                 actionRef.current.paused = true;
            }
        }
    }, [playing, animalType]);


    return (
        <div className="relative w-full h-full drop-shadow-[0_0_45px_rgba(255,255,255,.1)]">
            <video src="/background.mp4" loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover rounded-3xl"></video>
            <div ref={containerRef} className="relative w-full h-full rounded-3xl z-10">
                {children && <div className="absolute top-0 left-0 w-full h-full pointer-events-none">{children}</div>}
            </div>
        </div>
    );
};

export default ThreeScene;