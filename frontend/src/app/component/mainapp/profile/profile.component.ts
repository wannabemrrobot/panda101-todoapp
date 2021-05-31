import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { TodoService } from 'src/app/service/todo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  profileData: any;

  displayProgress = false;

  constructor(
    private _authService: AuthService,
    private _todoService: TodoService,
    private _router: Router
  ) {
    this.profileForm = new FormGroup({
      username : new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]{8,20}$'), Validators.minLength(8)]),
      tagname : new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9 ]{8,20}$'), Validators.minLength(8)]),
    })
  }

  updateProfile() {
    this.displayProgress = true;
    this.profileData.username = this.profileForm.value.username;
    this.profileData.tagname = this.profileForm.value.tagname;

    this._todoService.editProfile(this.profileData).subscribe((response: any) => {
      if(response.status == "success") {
        this.displayProgress = false;
        this.ngOnInit();
      }else {
        this.displayProgress = false;
      }
    })
  }

  triggerLogout() {
    this._authService.firebaseLogout();
    localStorage.removeItem('@todoList');
  }

  ngOnInit(): void {
    this.profileForm.controls.username.setValue(this.profileData.username);
    this.profileForm.controls.tagname.setValue(this.profileData.tagname);
  }
}
