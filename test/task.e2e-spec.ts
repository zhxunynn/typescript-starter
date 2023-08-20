import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/modules/app.module';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { Task, TaskManager } from '../src/model/task';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (GET) should return all tasks', async () => {
    const response = await request(app.getHttpServer()).get('/tasks');

    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveLength(2); // Assuming there are 2 tasks in the mock data
  });

  it('/tasks/:id (GET) should return correct task', async () => {
    const response = await request(app.getHttpServer()).get('/tasks/1');
    expect(response.status).toBe(HttpStatus.OK);
    expect(response.body).toHaveProperty('title', 'Homework');
  });

  it('/tasks/:id (DELETE) should delete desired task', async () => {
    const response = await request(app.getHttpServer()).del('/tasks/1');
    expect(response.status).toBe(HttpStatus.OK);
    const responseAfterDelete = await request(app.getHttpServer()).get(
      '/tasks',
    );
    expect(responseAfterDelete.body).toHaveLength(1);
  });

  it('/tasks (POST) should create correct task', async () => {
    const newTask3 = {
      title: 'Work',
      status: 'TODO',
      description: 'Start working',
    } as Task;
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask3);
    expect(response.status).toBe(HttpStatus.CREATED);
    const responseAfterCreate = await request(app.getHttpServer()).get(
      '/tasks',
    );
    expect(responseAfterCreate.body).toHaveLength(2);
  });
});
