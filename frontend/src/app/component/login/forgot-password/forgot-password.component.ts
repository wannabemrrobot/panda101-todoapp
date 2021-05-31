import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { faBrain, faPaperPlane, } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  // Data to be sent to the parent container
  resetEmail : any;

  // Icons
  faPaperPlane = faPaperPlane;
  faBrain = faBrain;

  constructor(protected dialogRef: NbDialogRef<any>) { }

  ngOnInit(): void {
  }

  submit() {
    this.dialogRef.close(this.resetEmail);
  }

  close(){
    this.dialogRef.close();
  }

}
