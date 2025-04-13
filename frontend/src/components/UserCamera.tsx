import { useEffect, useRef } from 'react';

function UserCamera() {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		let stream: MediaStream;

		async function getCameraStream() {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: true });
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (error) {
				console.error('Error accessing camera:', error);
			}
		}

		getCameraStream();

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
		};
	}, []);

	return <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-2xl shadow" />;
}

export default UserCamera;
