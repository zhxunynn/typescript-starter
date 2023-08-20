import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app/app.controller';
import { AppService } from '../services/app.service';
import { TaskController } from '../controllers/task/task.controller';
import { TaskService } from '../services/task.service';

@Module({
  imports: [],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
