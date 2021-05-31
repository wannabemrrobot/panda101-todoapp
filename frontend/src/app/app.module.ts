import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbTabsetModule, NbCardModule, NbToggleModule, NbIconModule, NbButtonModule, NbStepperModule, NbInputModule, NbTooltipModule, NbPopoverModule, NbDialogService, NbDialogModule, NbDialogRef, NbSidebarModule, NbSidebarService, NbSearchModule, NbSearchService, NbAccordionModule, NbCheckboxModule, NbSelectModule, NbActionsModule, NbCalendarModule, NbButtonGroupModule, NbDatepickerModule, NbToastrModule, NbToastrService, NbBadgeModule, NbProgressBarModule, NbUserModule, NbWindowModule, NbTrigger, NbRadioModule, } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './component/home/home.component';
import { MainappComponent } from './component/mainapp/mainapp.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { ForgotPasswordComponent } from './component/login/forgot-password/forgot-password.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WeatherService } from './service/weather.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HeaderComponent } from './component/mainapp/header/header.component';
import { SidebarComponent } from './component/mainapp/sidebar/sidebar.component';
import { AuthService } from './service/auth.service';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { TokenInterceptorService } from './service/token-interceptor.service';
import { AuthGuard } from './guard/auth.guard';
import { TodoService } from './service/todo.service';
import { CalendarDayComponent } from './component/mainapp/calendar-day/calendar-day.component';
import { TodoeditComponent } from './component/mainapp/todoedit/todoedit.component';
import { ProfileComponent } from './component/mainapp/profile/profile.component';
import { HelpComponent } from './component/mainapp/help/help.component';

// configs

const firebaseConfig = {
  apiKey: "// your firebase apikey",
  authDomain: "panda101todo.firebaseapp.com",
  projectId: "panda101todo",
  storageBucket: "panda101todo.appspot.com",
  messagingSenderId: "// messaging sender id not required",
  appId: "// app id"
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainappComponent,
    LoginComponent,
    ForgotPasswordComponent,
    HeaderComponent,
    SidebarComponent,
    CalendarDayComponent,
    TodoeditComponent,
    ProfileComponent,
    HelpComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbDatepickerModule.forRoot(),
    NbDatepickerModule,
    NbLayoutModule,
    NbTabsetModule,
    NbEvaIconsModule,
    NbInputModule,
    NbIconModule,
    NbCardModule,
    NbPopoverModule,
    NbStepperModule,
    NbSidebarModule,
    NbToggleModule,
    NbButtonModule,
    NbButtonGroupModule,
    NbSearchModule,
    NbTooltipModule,
    NbCheckboxModule,
    NbSelectModule,
    NbActionsModule,
    NbCalendarModule,
    NbAccordionModule,
    NbProgressBarModule,
    NbUserModule,
    NbBadgeModule,
    NbRadioModule,
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDialogModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'user/:action',
        component: LoginComponent
      },
      {
        path: 'panda',
        component: MainappComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '**',
        redirectTo: ''
      }
    ])
  ],
  providers: [
    NbDialogService, 
    NbSidebarService, 
    NbSearchService,
    DeviceDetectorService,
    WeatherService,
    AuthService,
    TodoService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
