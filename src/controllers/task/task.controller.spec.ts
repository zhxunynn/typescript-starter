import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../../services/task.service';
import { Task } from '../../model/task';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  describe('findOne', () => {
    it('should return a task when valid ID is provided', () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        status: 'IN_PROGRESS',
      } as Task;
      jest.spyOn(taskService, 'retrieveTaskById').mockReturnValue(mockTask);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      taskController.findOne(1, response);

      expect(taskService.retrieveTaskById).toHaveBeenCalledWith(1);
      expect(taskService.retrieveTaskById(1)).toBe(mockTask);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
      expect(response.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return empty array and NOT_FOUND status when task is not found', () => {
      jest.spyOn(taskService, 'retrieveTaskById').mockReturnValue(null);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      taskController.findOne(1, response);

      expect(taskService.retrieveTaskById).toHaveBeenCalledWith(1);
      expect(taskService.retrieveTaskById(1)).toBe(null);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith([]);
    });
  });

  describe('findAll', () => {
    it('should return all the tasks', () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'IN_PROGRESS' },
        { id: 2, title: 'Task 2', status: 'COMPLETED' },
      ] as Task[];
      jest.spyOn(taskService, 'retrieveTasks').mockReturnValue(mockTasks);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      taskController.findAll(response);

      expect(taskService.retrieveTasks).toHaveBeenCalled();
      expect(taskService.retrieveTasks()).toBe(mockTasks);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith(mockTasks);
    });
  });

  describe('create', () => {
    it('should create a new task', () => {
      const newTask = {
        id: 1,
        title: 'Test Task',
        status: 'TODO',
      } as Task;

      const mockCreatedTask: Task = { ...newTask };
      jest.spyOn(taskService, 'createTask').mockReturnValue(mockCreatedTask);

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      taskController.create(newTask, response);

      expect(taskService.createTask).toHaveBeenCalledWith(newTask);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith(mockCreatedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task when valid ID is provided', () => {
      const taskId = 1;

      jest.spyOn(taskService, 'deleteTaskById').mockReturnValue(true);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      taskController.remove(taskId, response);

      expect(taskService.deleteTaskById).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.ACCEPTED);
      expect(response.send).toHaveBeenCalled();
    });

    it('should return NOT_FOUND status when task is not found', () => {
      const taskId = 1;

      jest.spyOn(taskService, 'deleteTaskById').mockReturnValue(false);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      taskController.remove(taskId, response);

      expect(taskService.deleteTaskById).toHaveBeenCalledWith(taskId);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.send).toHaveBeenCalled();
    });
  });

  describe('all service test', () => {
    it('should create 2 new tasks', () => {
      const newTask1 = {
        title: 'Test Task1',
        status: 'TODO',
        description: 'Test Task No.1',
      } as Task;
      const newTask2 = {
        title: 'Test Task2',
        status: 'IN_PROGRESS',
        description: 'Test Task No.2',
      } as Task;
      const newTaskCreatedRes1 = taskService.createTask(newTask1);
      expect(newTaskCreatedRes1.title).toBe(newTask1.title);
      const newTaskCreatedRes2 = taskService.createTaskByDetail(
        newTask2.title,
        newTask2.description,
        newTask2.status,
      );
      expect(newTaskCreatedRes2.title).toBe(newTask2.title);
    });

    it('should return 2 tasks', () => {
      const newTask1 = {
        id: 0,
        title: 'Test Task1',
        status: 'TODO',
        description: 'Test Task No.1',
      } as Task;
      const newTask2 = {
        id: 1,
        title: 'Test Task2',
        status: 'IN_PROGRESS',
        description: 'Test Task No.2',
      } as Task;
      const allTasks = taskService.retrieveTasks();
      const tasksWithoutTimestamps = allTasks.map((task) => {
        const { createdAt, updatedAt, ...taskWithoutTimestamps } = task;
        return taskWithoutTimestamps;
      });
      expect(tasksWithoutTimestamps).toStrictEqual([newTask1, newTask2]);
    });

    it('should return task with id:0', () => {
      const newTask1 = {
        id: 0,
        title: 'Test Task1',
        status: 'TODO',
        description: 'Test Task No.1',
      } as Task;

      const resTask = taskService.retrieveTaskById(0);
      const { createdAt, updatedAt, ...expectedTask } = resTask;

      expect(expectedTask).toStrictEqual(newTask1);
    });

    it('should return task with id:1', () => {
      const newTask2 = {
        id: 1,
        title: 'Test Task2',
        status: 'IN_PROGRESS',
        description: 'Test Task No.2',
      } as Task;

      taskService.deleteTaskById(0);
      const resTasks = taskService.retrieveTasks();
      expect(resTasks.length).toBe(1);
      const { createdAt, updatedAt, ...expectedTask } = resTasks[0];

      expect(expectedTask).toStrictEqual(newTask2);
      expect(taskService.deleteTaskById(0)).toBe(false);
      expect(taskService.retrieveTaskById(0)).toBe(null);
    });
  });
});
