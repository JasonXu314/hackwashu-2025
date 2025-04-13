import { GeminiProcessor } from '@/lib/GeminiProcessor';
import { toB64, toF32Audio } from '@/lib/utils';
import { useEffect } from 'react';

const Test2: React.FC = () => {
	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then(async (stream) => {
				const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
				const ctx = new AudioContext({ sampleRate: 16_000 });
				await ctx.audioWorklet.addModule(GeminiProcessor);

				const src = ctx.createMediaStreamSource(stream);

				const node = new AudioWorkletNode(ctx, 'gemini-processor');
				src.connect(node);

				node.port.onmessageerror = (err) => console.error(err);
				node.port.onmessage = (evt) => {
					const buf: ArrayBuffer = evt.data.data;

					ws.send(toB64(buf));
				};

				let playing = false;
				const buffer: Float32Array[] = [];

				const flush = async () => {
					playing = true;

					while (buffer.length > 0) {
						const chunk = buffer.shift()!;

						const buf = ctx.createBuffer(1, chunk.length, 24_000);
						buf.copyToChannel(chunk, 0);

						const src = ctx.createBufferSource();
						src.buffer = buf;

						src.connect(ctx.destination);
						src.start(0);

						await new Promise<void>((resolve) =>
							src.addEventListener(
								'ended',
								() => {
									src.disconnect(ctx.destination);
									resolve();
								},
								{ once: true }
							)
						);
					}

					playing = false;
				};

				ws.addEventListener('message', (evt) => {
					const chunk = toF32Audio(evt.data);

					buffer.push(chunk);

					if (!playing) flush();
				});
			})
			.catch((err) => {
				console.error('rejected', err);
			});
	}, []);

	return <div></div>;
};

export default Test2;

