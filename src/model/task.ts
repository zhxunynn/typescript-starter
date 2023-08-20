export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskManager {
  private static instance: TaskManager;

  private tasks: Task[] = [];
  private taskIdCounter: number = 0;

  private constructor() {}

  static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  createTask(title: string, description: string, taskStatus: string): Task {
    const status: TaskStatus =
      TaskStatus[taskStatus as keyof typeof TaskStatus];
    const newTask: Task = {
      id: this.taskIdCounter++,
      title,
      description,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(taskId: number): Task | null {
    return this.tasks.find((task) => task.id === taskId) || null;
  }

  deleteTaskById(taskId: number): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id == taskId);

    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      return true;
    }

    return false;
  }
}
