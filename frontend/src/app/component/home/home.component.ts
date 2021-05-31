import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { ViewEncapsulation } from '@angular/core';
import { ThemeService } from 'src/app/service/theme.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToasterService } from 'src/app/service/toaster.service';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  toggleChecked = false;

  // browser detector variables
  deviceInfo : any;
  toasterPosition = 'top-right';
  toastProp = {
    status : '',
    message : ''
  }

  constructor(
    private router: Router, 
    private themeService: NbThemeService,
    private _localThemeService: ThemeService,
    private detector: DeviceDetectorService,
    private _localToasterService: ToasterService
    ) {
    // Listen for the theme change, and update the toggle state
    this.themeService.onThemeChange()
      .subscribe((theme: any) => {
        if(theme.name=='dark')
          this.toggleChecked = true;
        else if(theme.name=='default')
          this.toggleChecked = false;
    });

    this.detectBrowser();
  }

  detectBrowser() {
    this.deviceInfo = this.detector.getDeviceInfo().browser;

    if(this.deviceInfo.toLowerCase()=='chrome'){
      this.toastProp.status = 'success';
      this.toastProp.message = "Cool, you've been using Chrome, the best browser for the best user experience"
    }else if(this.deviceInfo.toLowerCase()=='firefox'){
      this.toastProp.status = 'warning';
      this.toastProp.message = "You've been using Mozilla, kindly switch to Chrome for better user experience"
    }else{
      this.toastProp.status = 'warning';
      this.toastProp.message = "This application is best designed to use with Google Chrome browser. Using other browsers may have poor user experience"
    }
  }

  ngOnInit(): void {
    // // displays toast on app initializing, about the user-agent
    this._localToasterService.showBrowserToast(
      this.toastProp.message,
      "top-right",
      this.toastProp.status,
      7000,
      'Browser Detection',
      true
    )

  }

  // Change theme on clicking the toggle
  changeTheme(event: any) {
    this._localThemeService.changeThemeOnToggle(event);
  }

  // Route to login and Register, on button click
  routeToLogin() {
    this.router.navigate(['/user', 'login']);
  }

  routeToSignUp() {
    this.router.navigate(['/user', 'signup']);
  }
  // -----------------------------------------------
}
