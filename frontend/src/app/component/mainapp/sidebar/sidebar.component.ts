import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { ToasterService } from 'src/app/service/toaster.service';
import { TodoService } from 'src/app/service/todo.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() isTodoAdded = new EventEmitter<boolean>();

  quotesFlippedStatus = false; // Initial flipStatus for Quotes Card
  quote : any; // Quotes in the sidebar

  // Form for the new Todo
  public newTodoForm : FormGroup; 
  priorityColor = 'basic'; // sets the color for select input of new Todo form

  // Icons
  faQuoteLeft = faQuoteLeft;
  faQuoteRight = faQuoteRight;

  // Quotes List
  QuotesList = [
    "Focus on being productive instead of busy.",
    "Do the hard jobs first. The easy jobs will take care of themselves.",
    "Productivity is being able to do things that you were never able to do before.",
    "It’s not always that we need to do more but rather that we need to focus on less.",
    "My goal is no longer to get more done, but rather to have less to do.",
    "You miss 100% of the shots you don’t take.",
    "Work gives you meaning and purpose and life is empty without it.",
    "When you combine ignorance and leverage, you get some pretty interesting results.",
    "The key is not to prioritize what’s on your schedule, but to schedule your priorities.",
    "Ordinary people think merely of spending time, great people think of using it.",
    "Absorb what is useful, reject what is useless, add what is specifically your own.",
    "Efficiency is doing better what is already being done.",
    // "Once you have mastered time, you will understand how true it is that most people overestimate what they can accomplish in a year – and underestimate what they can achieve in a decade!",
    "Why do anything unless it is going to be great?",
    "If there are nine rabbits on the ground, if you want to catch one, just focus on one.",
    "We have a strategic plan. It’s called doing things.",
    "The best minds are not in government. If any were, business would steal them away.",
    "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    "Efficiency is doing things right. Effectiveness is doing the right things.",
    "Action is the foundational key to all success.",
  ]

  constructor(
    private _todoService: TodoService,
    private _toasterService: ToasterService
  ) { 

    // Initialize new Form Group
    this.newTodoForm = new FormGroup({
      todo : new FormControl('', [Validators.required, Validators.pattern(".*[^ ].*")]),
      priority : new FormControl('', [Validators.required]),
      date : new FormControl('', [Validators.required])
    })

    // assign random Quote when app loads
    this.quote = this.QuotesList[Math.floor(Math.random()*this.QuotesList.length)];

  }

  ngOnInit(): void {
  }

  // Provide random quote
  getRandomQuote() {
    this.quotesFlippedStatus = !this.quotesFlippedStatus;
    this.quote = this.QuotesList[Math.floor(Math.random()*this.QuotesList.length)];  
  }

  // Add new todo
  addNewTodo() {
    if(this.newTodoForm.controls['todo'].hasError('required') || 
      this.newTodoForm.controls['priority'].hasError('required') || 
      this.newTodoForm.controls['date'].hasError('required')) {
      this._toasterService.showBrowserToast(
        "One or more fields is missing",
        "top-right",
        "danger",
        4000,
        "Error Adding Todo",
        true
      )
    }

    if(this.newTodoForm.controls['todo'].hasError('pattern') || 
      this.newTodoForm.value.todo == "") {
      this._toasterService.showBrowserToast(
            "Todo contains only white spaces or it is empty",
            "top-right",
            "danger",
            4000,
            "Error Adding Todo",
            true
          )
    }
    if(!this.newTodoForm.invalid) {

      let newTodo = this.newTodoForm.value;
      this._todoService.addTodo(newTodo).subscribe((response: any) => {
        if(response.status=='error') {
          this._toasterService.showBrowserToast(
            "There seems to be a problem adding the todo. Please, try after sometime.",
            "top-right",
            "danger",
            4000,
            "Error Adding Todo",
            true
          )
        }else{
          this.isTodoAdded.emit(true)
        }
      })

      this.newTodoForm.reset();
      this.priorityColor = 'basic';
    }
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

  // Reset newTodo form
  resetTodoForm() {
    this.newTodoForm.reset();
    this.priorityColor = 'basic';
  }

}
