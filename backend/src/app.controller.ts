import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly service: AppService) {}

	@Post('/begin')
	public startChat(): string {
		return this.service.beginChat();
	}

	@Post('/prompt')
	public async promptChat(@Body('msg') msg: string, @Body('id') id: string): Promise<string> {
		return this.service.prompt(id, msg);
	}
}

