import { Injectable } from '@nestjs/common';
import { TaskManager, Task, TaskStatus } from '../model/task';

@Injectable()
export class TaskService {
  createTask(task: Task): any {
    return this.createTaskByDetail(task.title, task.description, task.status);
  }

  createTaskByDetail(
    title: string,
    description: string,
    status: TaskStatus,
  ): any {
    return TaskManager.getInstance().createTask(title, description, status);
  }

  retrieveTaskById(id: number): any {
    return TaskManager.getInstance().getTaskById(id);
  }

  retrieveTasks(): Task[] {
    return TaskManager.getInstance().getAllTasks();
  }

  deleteTaskById(id: number): Boolean {
    return TaskManager.getInstance().deleteTaskById(id);
  }
}
