import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-todoedit',
  templateUrl: './todoedit.component.html',
  styleUrls: ['./todoedit.component.scss']
})
export class TodoeditComponent implements OnInit {

  // Form for the new Todo
  public editTodoForm : FormGroup;
  todoObj: any;

  priorityColor = "basic";

  constructor(
    protected dialogRef: NbDialogRef<TodoeditComponent>
  ) { 

    // Initialize new Form Group
    this.editTodoForm = new FormGroup({
      todo : new FormControl('', [Validators.required, Validators.pattern(".*[^ ].*")]),
      priority : new FormControl('', [Validators.required]),
      date : new FormControl('', [Validators.required])
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.todoObj.todo = this.editTodoForm.value.todo;
    this.todoObj.priority = this.editTodoForm.value.priority;
    this.todoObj.date = this.editTodoForm.value.date;
    console.log("response: ", this.todoObj)
    this.dialogRef.close(this.todoObj);
  }

  // Change the priority selector color on value select
  priorityColorChange(event: any) {
    if(event==1){
      this.priorityColor = 'danger';
    }else if(event==2){
      this.priorityColor = 'info';
    }else if(event==3){
      this.priorityColor = 'success'; 
    }
  }

  ngOnInit(): void {
    this.editTodoForm.controls.todo.setValue(this.todoObj.todo);
    this.editTodoForm.controls.date.setValue(new Date(this.todoObj.date));

    if(this.todoObj.priority == "high") {
      this.editTodoForm.controls.priority.setValue("1");
      this.priorityColor = "danger"
    }else if(this.todoObj.priority == "medium") {
      this.editTodoForm.controls.priority.setValue("2");
      this.priorityColor = 'info';
    }else{
      this.editTodoForm.controls.priority.setValue("3");
      this.priorityColor = 'success';
    }
  }

}
