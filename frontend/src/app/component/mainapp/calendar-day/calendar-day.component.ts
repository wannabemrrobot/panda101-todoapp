import { Component, OnInit } from '@angular/core';
import { NbCalendarDayCellComponent, NbDateService } from '@nebular/theme';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.scss']
})
export class CalendarDayComponent extends NbCalendarDayCellComponent<Date> implements OnInit {

  PendingDates: any = [];
  CompletedDates: any = [];
  TrashedDates: any = [];

  todoList: any = [];

  displayDot = false;
  dotColor = "#3366ff";

  constructor(dateService: NbDateService<Date>) {
    super(dateService);
  }

  ngOnInit(): void {
    if(!!localStorage.getItem('@todoList')) {
      this.todoList = localStorage.getItem('@todoList');
      this.todoList = JSON.parse(this.todoList)
      for(let todo of this.todoList) {
        
        if(todo.trashed == true) {
          this.TrashedDates.push(new Date(todo.date))
        }else{
          if(todo.completed == false) {
            this.PendingDates.push(new Date(todo.date))
          }else{
            this.CompletedDates.push(new Date(todo.date))
          }
        }
        
      }

      for(let date of this.PendingDates) {
        if(this.date.toString() == date.toString()) {
          this.displayDot = true;
          this.dotColor = "#0084ff";
        }
      }

      for(let date of this.CompletedDates) {
        if(this.date.toString() == date.toString()) {
          this.displayDot = true;
          this.dotColor = "#00d68f";
        }
      }

      for(let date of this.TrashedDates) {
        if(this.date.toString() == date.toString()) {
          this.displayDot = true;
          this.dotColor = "#ff3d71";
        }
      }
    }
  }

}
