import { Component, OnInit } from '@angular/core';
import { Task,TaskResponse } from '../task';
import {C4cTasksService} from '../c4c-tasks.service'

@Component({
  selector: 'app-c4c-task',
  templateUrl: './c4c-task.component.html',
  styleUrls: ['./c4c-task.component.css']
})
export class C4cTaskComponent implements OnInit {
  task:Task
  createdTask:TaskResponse
  
  constructor(private c4cTaskService:C4cTasksService) { }

  ngOnInit(): void {
  }
  add(subject: string): void {
    console.log(`Add subject ${subject}`);
    this.c4cTaskService.createTask(subject)
      .subscribe(taskResponse => {
        console.log('task created');
        this.createdTask = taskResponse;
      });
  }
}
