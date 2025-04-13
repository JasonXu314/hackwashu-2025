import { GeminiProcessor } from '@/lib/GeminiProcessor';
import { toB64, toF32Audio } from '@/lib/utils';
import { useEffect } from 'react';

const Test2: React.FC = () => {
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(async (stream) => {
				const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
				const ctx = new AudioContext();
				console.log(ctx);
				await ctx.audioWorklet.addModule(GeminiProcessor);
				console.log('added');

				ws.onopen = () => console.log('open');
				ws.onerror = (err) => console.error(err);

				const src = ctx.createMediaStreamSource(stream);

				const node = new AudioWorkletNode(ctx, 'gemini-processor');
				src.connect(node);

				node.port.onmessage = (evt) => {
					console.log(evt);

					const buf: ArrayBuffer = evt.data;

					ws.send(toB64(buf));
				};

				ws.addEventListener('message', (evt) => {
					const chunk = toF32Audio(evt.data);

					const buf = ctx.createBuffer(1, chunk.length, 24_000);
					buf.copyToChannel(chunk, 0);

					const src = ctx.createBufferSource();
					src.buffer = buf;

					src.connect(ctx.destination);
					src.start(0);
				});
			})
			.catch((err) => {
				console.error('rejected', err);
			});
	}, []);

	return <div></div>;
};

export default Test2;

