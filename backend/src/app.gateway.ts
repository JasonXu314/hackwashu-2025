import { Session } from '@google/genai';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import WebSocket from 'ws';
import { AppService } from './app.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket> {
	private readonly sessions: Map<WebSocket, Session>;

	public constructor(private readonly service: AppService) {
		this.sessions = new Map();
	}

	public async handleConnection(client: WebSocket): Promise<void> {
		const session = await this.service.beginAudio(client);

		this.sessions.set(client, session);

		client.on('message', (data: Buffer) => session.sendRealtimeInput({ media: { data: data.toString(), mimeType: 'audio/pcm;rate=16000' } }));
	}

	public async handleDisconnect(client: WebSocket): Promise<void> {
		const session = this.sessions.get(client);

		session?.close();
	}
}

