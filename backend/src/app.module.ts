import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { serveClient } from './utils/utils';

@Module({
	imports: [...serveClient()],
	controllers: [AppController],
	providers: [AppService, AppGateway]
})
export class AppModule {}

