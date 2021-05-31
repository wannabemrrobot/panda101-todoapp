import { Component, ViewEncapsulation } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {

  declare document: Document;
  
  constructor(
    private _localThemeService: ThemeService
  ) {

    // change theme on app load, from the theme service
    this._localThemeService.changeThemeOnLoad();
  }
  
  title = 'panda101';
}
