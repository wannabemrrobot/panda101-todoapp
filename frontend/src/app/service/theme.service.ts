import { Injectable } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private _themeService: NbThemeService
  ) { }

  changeThemeOnLoad() {
    
    let theme = localStorage.getItem('@theme');

    if(theme=='dark'){
      this._themeService.changeTheme('dark')
    }else{
      this._themeService.changeTheme('default')
    }
  }

  changeThemeOnToggle(darkMode: boolean) {
    if(darkMode==true) {
      this._themeService.changeTheme('dark')
      localStorage.setItem('@theme', 'dark')
    }else{
      this._themeService.changeTheme('default')
      localStorage.setItem('@theme', 'default')
    }
  }
}
