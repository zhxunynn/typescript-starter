import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { TaskService } from '../../services/task.service';
import { Task } from 'src/model/task';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const task = this.taskService.retrieveTaskById(id);
    if (!task) {
      res.status(HttpStatus.NOT_FOUND).json([]);
    } else {
      res.status(HttpStatus.OK).json(task);
    }
  }

  @Get()
  findAll(@Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK).json(this.taskService.retrieveTasks());
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Res() res: Response) {
    const deleteRes = this.taskService.deleteTaskById(id);
    if (deleteRes) {
      res.status(HttpStatus.OK).send();
    } else {
      res.status(HttpStatus.NOT_FOUND).send();
    }
  }

  @Post()
  create(@Body() task: Task, @Res() res: Response) {
    const createdTask = this.taskService.createTask(task);
    res.status(HttpStatus.CREATED).json(createdTask);
  }
}
