const blob = new Blob(
	[
		`
	class GeminiProcessor extends AudioWorkletProcessor {
		constructor() {
			super();

			this.buffer = new Int16Array(2048);
			this.hwi = 0;
		}

		process(inputs) {
			if (inputs[0].length) {
				this.processChunk(inputs[0][0]);
			}

			return true;
		}

		// sourced from https://github.com/googleapis/js-genai/blob/main/sdk-samples/index.html
		processChunk(float32Array) {
			const l = float32Array.length;

			for (let i = 0; i < l; i++) {
				// convert float32 -1 to 1 to int16 -32768 to 32767
				this.buffer[this.hwi++] = float32Array[i] * 32768;

				if(this.bufferWriteIndex >= this.buffer.length) {
					this.port.postMessage({
						event: 'chunk',
						data: this.buffer.slice(0, this.bufferWriteIndex).buffer
					});

					this.hwi = 0;
				}
			}

			if (this.bufferWriteIndex >= this.buffer.length) {
				this.port.postMessage({
					event: 'chunk',
					data: this.buffer.slice(0, this.bufferWriteIndex).buffer
				});

				this.hwi = 0;
			}
		}
	}

	registerProcessor('gemini-processor', GeminiProcessor);
	`
	],
	{ type: 'application/javascript' }
);

export const GeminiProcessor = URL.createObjectURL(blob);

