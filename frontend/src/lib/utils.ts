export function toB64(buf: ArrayBuffer) {
	let binary = '';

	const bytes = new Uint8Array(buf);
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);

	return btoa(binary);
}

// also sourced from https://github.com/googleapis/js-genai/blob/main/sdk-samples/index.html
export function toF32Audio(b64: string) {
	const byteCharacters = atob(b64);
	const byteArray = [];

	for (let i = 0; i < byteCharacters.length; i++) {
		byteArray.push(byteCharacters.charCodeAt(i));
	}

	const audioChunks = new Uint8Array(byteArray);

	// Convert Uint8Array (which contains 16-bit PCM) to Float32Array
	const length = audioChunks.length / 2; // 16-bit audio, so 2 bytes per sample
	const float32AudioData = new Float32Array(length);

	for (let i = 0; i < length; i++) {
		// Combine two bytes into one 16-bit signed integer (little-endian)
		let sample = audioChunks[i * 2] | (audioChunks[i * 2 + 1] << 8);
		// Convert from 16-bit PCM to Float32 (range -1 to 1)
		if (sample >= 32768) sample -= 65536;
		float32AudioData[i] = sample / 32768;
	}

	return float32AudioData;
}

