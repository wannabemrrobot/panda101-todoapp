import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TodoService } from 'src/app/service/todo.service';
import { ToasterService } from 'src/app/service/toaster.service';
import { faBan, faFeather, faHourglassStart, faTint, faTree } from '@fortawesome/free-solid-svg-icons';
import { faCanadianMapleLeaf, faGripfire } from '@fortawesome/free-brands-svg-icons';
import { WeatherService } from 'src/app/service/weather.service';
import { Subscription, timer } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';
import { TodoeditComponent } from './todoedit/todoedit.component';

@Component({
  selector: 'app-mainapp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mainapp.component.html',
  styleUrls: ['./mainapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [CalendarDayComponent]
})
export class MainappComponent implements OnInit {

  autoReload = false;
  displayProgress = false;

  displaySearch = false;
  searchResults: any = [];
  noSearchResult = false;
  searchTerm: any;

  today = new Date();

  todoListCompleted: any = [];
  todoListPending: any = [];
  todoListTrashed: any = [];
  haveTodos = false;
  preventCompletion = false;
  progress = 0;
  progressColor: any;
  progressComment: any;
  progressTextColor: any;
  triggerFooterComment = false;

  trashToggle: boolean = false;
  trashToggleStatus: string = "danger"

  doneAllQuoteList = [
    {
      icon: "heart-outline",
      quote: "No more todos. Step out and Spread Love."
    },
    {
      icon: "heart-outline",
      quote: "No more todos. Step out and Spread Love."
    },
    {
      icon: "heart-outline",
      quote: "No more todos. Step out and Spread Love."
    }
    ,
    {
      icon: "done-all-outline",
      quote: "You did it, Procrastinator! All tasks done."
    },
    {
      icon: "charging-outline",
      quote: "Beast Mode Off. No tasks to do."
    },
    {
      icon: "charging-outline",
      quote: "Beast Mode Off. No tasks to do."
    },
    {
      icon: "clock-outline",
      quote: "Keep Going Pal, add new todo to keep your pace."
    },
    {
      icon: "flash-outline",
      quote: "Well tell them, you did it."
    }
    ,
    {
      icon: "flash-outline",
      quote: "Well tell them, you did it"
    }
    ,
    {
      icon: "headphones-outline",
      quote: "Put on your headphones, turn up the volume and groove."
    }
    ,
    {
      icon: "music-outline",
      quote: "Put on your headphones, turn up the volume and groove."
    }
    ,
    {
      icon: "power-outline",
      quote: "No more todos. Turn off your computer and get Life."
    }
    ,
    {
      icon: "checkmark-circle-outline",
      quote: "No more tasks, to do. Turn off your timer!"
    }
    ,
    {
      icon: "clock-outline",
      quote: "Turn on your pomodoro timer, and get working!"
    }
    ,
    {
      icon: "power-outline",
      quote: "No more todos. Turn off your computer and get Life."
    }
  ]
  doneAllQuote: any;

  pandaUserData : any; // data from the API

  // components belong to the right page
    // Calendar element
    calendarSelectedDate = new Date();          // variable to hold selected calendar date
    customDayCellComponent = CalendarDayComponent;

    // Clock element
    rxTime = new Date();                        // new date Object
    subscription: any;                          // create subscription variable to hold subscription
    clockReveal = false;                        // to reveal the clock Quote on hover
  
    // weather element
    weatherDegree: any;                         // weather degree from weather API
    weatherIcon: any;                           // url for weather icon
    weatherDescription: any;                    // weather description from weather API
    weatherIconsURL = {
      sunny : './../../../../assets/images/weatherIcons/png/Sun-thin.png',
      rain : './../../../../assets/images/weatherIcons/png/Rain-thin.png',
      clouds : './../../../../assets/images/weatherIcons/png/Cloud-thin.png',
      clear : './../../../../assets/images/weatherIcons/png/Sun-thin.png',
      snow : './../../../../assets/images/weatherIcons/png/Snow-thin.png',
      thunderstorm : './../../../../assets/images/weatherIcons/png/Storm-thin.png',
      other : './../../../../assets/images/weatherIcons/png/PartlySunny-thin.png'
    }
  
    // Audio player
    audio = new Audio();                        // create a new audio Object
    completeAudio = new Audio()                 // create a new audio Object for click effect
    deleteAudio = new Audio()                   // create a new audio Object for click effect

    whiteNoiseInfo: any = "dark jungle";
    whiteNoiseInfoIcon = faTree;              
    whiteNoiseStatus: any = "paused";           // noise playing status
    whiteNoisePlayColor: any = "info";          // play button color
    whiteNoisePlayIconColor: any = "";          // play button icon color
    disableWhiteNoise = false;                  // disable noise toggles
  
    previousInfo: any;
    previousIcon: any;
    previousNoiseURL: any
  
    // Icons
    faBan = faBan;
    faTree = faTree;
    faTint = faTint;
    faGripfire = faGripfire;
    faFeather = faFeather;
    faHourglassStart = faHourglassStart;
    faCanadianMapleLeaf = faCanadianMapleLeaf;

  constructor(
    private ref: ChangeDetectorRef,
    private dialogService: NbDialogService,
    private _toasterService: ToasterService,
    private _todoService: TodoService,
    private weatherService: WeatherService,
  ) 
  {
        // load default audio values on component load
        this.audio.src = "./../../../../assets/music/forest-whitenoise.mp3";
        this.audio.volume = 1;
        this.audio.load();

        this.completeAudio.src = "./../../../../assets/ui-sound/click.mp3"
        this.completeAudio.volume = 0.6;
        this.completeAudio.load();

        this.deleteAudio.src = "./../../../../assets/ui-sound/delete.mp3"
        this.deleteAudio.volume = 0.6;
        this.deleteAudio.load();
  }

  // Change the todo status
  changeTodoStatus(todoObj: any, event: any) {

    if(event == "false") {
      event = {
        target : {
          checked : false
        }
      }
      event.target.checked = false;
    }else if(event == "true") {
      event = {
        target : {
          checked : true
        }
      }
      event.target.checked = true;
    }

    // if(this.autoReload==true) {
    //   this.displayProgress = true;
    //   this.preventCompletion = true;
    //   this._todoService.changeTodoStatus(todoObj, event.target.checked).subscribe(
    //     (response: any) => {
    //       if(response.status=='success'){
    //         this.getTodo();
    //         this.preventCompletion = false;
    //         this.displayProgress = false;
    //       }else{
    //         this.getTodo();
    //         this.preventCompletion = false;
    //         this.displayProgress = false;
    //       }
    //     },
    //     (error) => {
    //       console.log("error occured!")
    //       this.getTodo();
    //       this.preventCompletion = false;
    //       this.displayProgress = false;
    //     })
    // }else{
    //   this._todoService.changeTodoStatus(todoObj, event.target.checked).subscribe((response: any) => {})
    // }

    this.displayProgress = true;
    this.preventCompletion = true;
    this._todoService.changeTodoStatus(todoObj, event.target.checked).subscribe(
      (response: any) => {
        if(response.status=='success'){
          this.getTodo();
          this.preventCompletion = false;
          this.displayProgress = false;
        }else{
          this.getTodo();
          this.preventCompletion = false;
          this.displayProgress = false;
        }
      },
      (error) => {
        this.getTodo();
        console.log(error)
        this._toasterService.showBrowserToast(
          "Periodical synchronization is complete.",
          "top-right",
          "control",
          4000,
          "Sync Manager",
          true
        )

        this.preventCompletion = false;
        this.displayProgress = false;
      })

    if(!this.disableWhiteNoise) {
      this.completeAudio.play();
    }
  }

  // Delete the todos on button click
  deleteTodo(todo: any) {
    this.displayProgress = true;
    if(!this.disableWhiteNoise){
      this.deleteAudio.play();
    }

    this._todoService.changeDeleteStatus(todo).subscribe((response: any) => {
      if(response.status == "success") {
        this.getTodo();
        this.displayProgress = false;
      }else{
        this.getTodo();
        this.displayProgress = false;
      }
    }, 
    (error) => {
      this.getTodo();
      this.displayProgress = false;
    })
  }

  detectPriority(priority: any) {
    if(priority == "high") {
      return "danger";
    }else if(priority == "medium") {
      return "primary";
    }else {
      return "success";
    }
  }

  editTodo(todo: any) {
    this.dialogService.open(TodoeditComponent, 
      { 
        context: { todoObj: todo },
        closeOnBackdropClick: false
      })
      .onClose.subscribe((todoObj: any) => {
        this._todoService.editTodo(todoObj).subscribe(
          (response: any) => {
            if(response.status == "success") {
              this.getTodo();
            }else{
              this.getTodo();
            }
        }, 
        (error) => {
          this.getTodo();
        })
      });
  }

  // Clear everything in the trash
  clearTrash() {
    this.displayProgress = true;
    this.displayProgress = true;
    if(!this.disableWhiteNoise){
      this.deleteAudio.play();
    }

    this._todoService.clearTrash().subscribe(
      (response: any) => {
        if(response.status == "success") {
          this.getTodo();
          this.displayProgress = false;
        }else{
          this.getTodo();
          this.displayProgress = false;
        }
    },
    (error) => {
      this.getTodo();
      this.displayProgress = false;
    })
  }

  searchTodo(query: string) {
    this.haveTodos = true;
    this.searchTerm = query;
    this.displaySearch = true;
    this.searchResults = [];

    for(let todo of this.pandaUserData.todo) {
      if((todo.todo).toLowerCase().includes(query.toLowerCase()) == true && todo.trashed == false) {
        this.searchResults.push(todo);
        this.noSearchResult = false;
      }
    }

    if(this.searchResults.length == 0) {
      this.noSearchResult = true;
    }
  }

  closeSearch() {
    this.displaySearch=false;
    // trigger the NoTodo div in main component
    if(this.todoListPending.length > 0) {
      this.haveTodos = true;
    }else{
      this.haveTodos = false;
      this.doneAllQuote = this.doneAllQuoteList[Math.floor(Math.random()*this.doneAllQuoteList.length)];
    }
  }

  refreshTodo(event: any) {
    if(event==true) {
      this.getTodo();
    }
  }

  setReloadMode(event: boolean) {
    if(event==true) {
      this.autoReload = true;
      this.getTodo();
    }else{
      this.autoReload = false;
      this.getTodo();
    }
  }

  hotReload(event: boolean) {
    if(event==true) {
      this.preventCompletion = false;
      this.getTodo();
    }
  }

  revealClockCard() {
    this.clockReveal = !this.clockReveal;
  }

  toggleTrash() {
    if(this.trashToggle == false) {
      this.trashToggle = true;
      this.trashToggleStatus = "success";
    }else {
      this.trashToggle = false;
      this.trashToggleStatus = "danger";
    }
  }

  toggleDND(event: any) {
    if(event==true) {
      this.previousInfo = this.whiteNoiseInfo;
      this.previousIcon = this.whiteNoiseInfoIcon;
      this.previousNoiseURL = this.audio.src;
      
      this.disableWhiteNoise = true;            // disable all the noise controls
      this.audio.pause();                       // pause playing when DND is on
      this.whiteNoiseStatus = "disabled";       // set whiteNoise display status to disabled
      this.whiteNoiseInfo = "DND enabled"
      this.whiteNoiseInfoIcon = faBan;
    }else{
      this.audio.src = this.previousNoiseURL;
      this.whiteNoiseInfo = this.previousInfo;
      this.whiteNoiseInfoIcon = this.previousIcon;

      this.disableWhiteNoise = false;
      this.whiteNoiseStatus = "paused";
      this.whiteNoisePlayColor = "info";
      this.whiteNoisePlayIconColor = "#fff";

    }
  }

  playWhiteNoise() {
    
    if(this.audio.paused) {
      this.audio.play();                        // start playing the audio
      this.whiteNoiseStatus = "playing";        // change the playing status
      this.whiteNoisePlayColor = "success";     // change the playing button color
      this.whiteNoisePlayIconColor = "#000";    // change the playing button icon color


    }else{
      this.audio.pause();                       // pause the audio
      this.whiteNoiseStatus = "paused";         // change the playing status
      this.whiteNoisePlayColor = "info";        // change the playing button color
      this.whiteNoisePlayIconColor = "#fff";    // change the playing button icon color
    }
  }

  selectWhiteNoise(event: any) {

    this.audio.pause();                         // pause audio on every selection
    this.whiteNoiseStatus = "paused";           // change the playing status - paused
    this.whiteNoisePlayColor = "info";          // change the playing button color to default
    this.whiteNoisePlayIconColor = "#fff";      // change the playing button icon color

    if(event=="forest") {
      this.audio.src = "./../../../../assets/music/forest-whitenoise.mp3";
      this.whiteNoiseInfo = "dark jungle";
      this.whiteNoiseInfoIcon = faTree;
    }else if(event=="rain") {
      this.audio.src = "./../../../../assets/music/rain-whitenoise.mp3";
      this.whiteNoiseInfo = "winter rain";
      this.whiteNoiseInfoIcon = faTint;
    }else if(event=="birds") {
      this.audio.src = "./../../../../assets/music/birds-whitenoise.mp3";
      this.whiteNoiseInfo = "jungle birds";
      this.whiteNoiseInfoIcon = faFeather;
    }else if(event=="fire") {
      this.audio.src = "./../../../../assets/music/fire-whitenoise.mp3";
      this.whiteNoiseInfo = "camp fire";
      this.whiteNoiseInfoIcon = faGripfire;
    }
  }

  getTodo() {
    this.displayProgress = true;

    this._todoService.getTodo().subscribe((userObj) => {
      
      this.pandaUserData = userObj;
      localStorage.setItem('@todoList', JSON.stringify(this.pandaUserData.todo))

      for(let todo of this.pandaUserData.todo) {
        if(todo.priority == 1) {
          todo.priority = "high"
        }else if(todo.priority == 2) {
          todo.priority = "medium"
        }else if(todo.priority == 3){
          todo.priority = "low"
        }
      }

      this.todoListPending = [];
      this.todoListCompleted = [];
      this.todoListTrashed = [];
      
      // to create a separate list of todolist as completed, pending and trashed
      for(let todo of this.pandaUserData.todo) {

        if(todo.trashed==true) {
          this.todoListTrashed.push(todo);
        }else {
          if(todo.completed==false) {
            this.todoListPending.push(todo);
          }else{
            this.todoListCompleted.push(todo);
          }
        }
      }

      // trigger the NoTodo div in main component
      if(this.todoListPending.length > 0) {
        this.haveTodos = true;
      }else{
        this.haveTodos = false;
        this.doneAllQuote = this.doneAllQuoteList[Math.floor(Math.random()*this.doneAllQuoteList.length)];
      }

      // compute values for progress bar and bar color
      this.progress = this.todoListCompleted.length / (this.todoListPending.length + this.todoListCompleted.length) * 100;
      if(this.progress <= 25) {
        this.progressColor = "danger"
        this.progressTextColor = "#ff3d71"
        this.progressComment = "Woah, baby panda just started to crawl."
      }else if(this.progress <=50) {
        this.progressColor = "warning"
        this.progressTextColor = "#ffaa00"
        this.progressComment = "Run panda... Run!"
      }else if(this.progress <=75) {
        this.progressColor = "primary"
        this.progressTextColor = "#3366ff"
        this.progressComment = "Have you seen panda entering a beast mode, look yourself!"
      }else if(this.progress <=100) {
        this.progressColor = "success"
        this.progressTextColor = "#00d68f"
        this.progressComment = "The Panda just entered God Mode!"
      }
    })

    this.displayProgress = false;
  }

  ngOnInit(): void {
    // assign values on ngOnInit, to prevent variable undefined warning
    this.pandaUserData = {
      username : 'loading...',
      tagname : 'loading...',
      email : 'loading...',
      todo : {
        todo: '',
        priority: 1,
        completed: false,
        date: this.today
      }
    }
    this.doneAllQuote = this.doneAllQuoteList[Math.floor(Math.random()*this.doneAllQuoteList.length)];

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
        this.ref.markForCheck();
      });

    // Get weather info
    this.weatherService.getWeather().subscribe(weather => {
      if(weather) {
        this.weatherDescription = weather.weather.description;
        this.weatherDegree = parseInt((parseFloat(weather.degree)-273.15)+"");

        if(weather.weather.main.toLowerCase()=='clouds'){
          this.weatherIcon = this.weatherIconsURL.clouds;
        }else if(weather.weather.main.toLowerCase()=='thunderstorm'){
          this.weatherIcon = this.weatherIconsURL.thunderstorm;
        }else if(weather.weather.main.toLowerCase()=='clear'){
          this.weatherIcon = this.weatherIconsURL.clear;
        }else if(weather.weather.main.toLowerCase()=='sunny'){
          this.weatherIcon = this.weatherIconsURL.sunny;
        }else if(weather.weather.main.toLowerCase()=='snow'){
          this.weatherIcon = this.weatherIconsURL.snow;
        }else if(weather.weather.main.toLowerCase()=='rain'){
          this.weatherIcon = this.weatherIconsURL.rain;
        }else{
          this.weatherIcon = this.weatherIconsURL.other;
        }
      }else{
        this.weatherDegree = 'nil';
        this.weatherDescription = 'weather unavailable'
      }
    })

    this.getTodo();
  }
}