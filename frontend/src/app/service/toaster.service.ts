import { Injectable } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(
    private toastrService: NbToastrService
  ) { }

  // Show toast template
  showBrowserToast(message: any, position: any, status: any, duration: number, title: any, preventDuplicates: any) {
    this.toastrService.show(
      message,
      title,
      { position, status, duration, preventDuplicates , limit: 3});
  }
}
