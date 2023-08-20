import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { TaskManager } from './model/task';

// Fake Database
const LoadDatabase = () => {
  TaskManager.getInstance().createTask(
    'Interview',
    'Interview with Luke',
    'COMPLETED',
  );
  TaskManager.getInstance().createTask(
    'Homework',
    'Take Home Exercises',
    'IN_PROGRESS',
  );
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
LoadDatabase();
bootstrap();
