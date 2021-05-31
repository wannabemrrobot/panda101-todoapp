import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NbSearchService, NbThemeService, NbWindowService } from '@nebular/theme';
import { ThemeService } from 'src/app/service/theme.service';
import { HelpComponent } from '../help/help.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
   
  today = new Date();                                                 // date Object for the data Button
  toggleChecked: any;                                                 // Dark Mode toggle
  searchAnimation: any;
  searchAnimationList = [
    'modal-zoomin', 
    'rotate-layout', 
    'modal-move', 
    'curtain', 
    'rotate-layout',
    'column-curtain', 
    'modal-drop', 
    'modal-half',
    'rotate-layout',
    'rotate-layout'
  ]

  @Input() parentData : any;                                          // user profile data from the parent(Main App Component)
  @Output() searchTerm = new EventEmitter<string>();
  @Output() doHotReload = new EventEmitter<boolean>();
  @Output() autoReload = new EventEmitter<boolean>();
  autoReloadButton = true;

  constructor(
    private searchService: NbSearchService,
    private themeService: NbThemeService,
    private windowService: NbWindowService,
    private _localThemeService: ThemeService
  ) {
    
    // keep toggle in sync with the current theme state
    this.themeService.onThemeChange()
    .subscribe((theme: any) => {
      if(theme.name=='dark'){
        this.toggleChecked = true;
      }
      else if(theme.name=='default'){
        this.toggleChecked = false;
      }
    });

    // Handle Search Data
    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        this.searchTerm.emit(data.term);
      })
  }

  // Change theme on toggle event
  changeTheme(event: any) {
    this._localThemeService.changeThemeOnToggle(event);
  }

  setReloadMode(event: any) {
    if(event==true) {
      this.autoReload.emit(true);
      this.autoReloadButton = true;
    }else{
      this.autoReload.emit(false);
      this.autoReloadButton = false;
    }
  }

  // hotReloading the parent component
  hotReload() {
    this.doHotReload.emit(true);
  }

  ngOnInit(): void {
    // Random animation for the todo searching
    this.searchAnimation = this.searchAnimationList[Math.floor(Math.random()*this.searchAnimationList.length)];
  }

  openProfile() {
    this.windowService.open(
      ProfileComponent,
      { title: "Uh! You stepped into Profile settings.", context: { profileData: this.parentData }},
    );
  }

  openHelp() {
    this.windowService.open(
      HelpComponent,
      { title: "You got to know more about panda101 here!" },
    );
  }

}
