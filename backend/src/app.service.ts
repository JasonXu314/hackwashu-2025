import { Chat, GoogleGenAI, Modality, Session } from '@google/genai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WebSocket } from 'ws';

interface ChatRecord {
	chat: Chat;
	death: NodeJS.Timeout;
}

@Injectable()
export class AppService {
	private readonly ai: GoogleGenAI;
	private readonly chats: Map<string, ChatRecord>;

	public constructor() {
		this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
		this.chats = new Map();
	}

	public async beginAudio(socket: WebSocket): Promise<Session> {
		const session = await this.ai.live.connect({
			model: 'gemini-2.0-flash-live-001',
			config: { responseModalities: [Modality.AUDIO] },
			callbacks: {
				onmessage: (evt) => {
					const data = evt.serverContent?.modelTurn?.parts?.[0].inlineData?.data!;

					if (data) {
						socket.send(data);
					}
				}
			}
		});

		session.sendClientContent({
			turns: ['You are a therapist giving advice to a patient. Provide direct, actionable feedback to help your patient relieve their worries.'],
			turnComplete: true
		});

		return session;
	}

	public beginChat(): string {
		const id = randomUUID();

		const chat = this.ai.chats.create({ model: 'gemini-2.0-flash-thinking-exp' });
		this.chats.set(id, { chat, death: setTimeout(() => this.chats.delete(id), 3 * 60_000) });

		return id;
	}

	public async prompt(id: string, msg: string): Promise<string> {
		const chat = this.chats.get(id);

		if (!chat) throw new BadRequestException('Chat not found');

		return chat.chat.sendMessage({ message: msg }).then((res) => res.text!);
	}
}

