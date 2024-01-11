import { Component, ViewChild } from '@angular/core';
import { ToastService } from './shared/service/toast.service';
import { DxToastComponent } from 'devextreme-angular';
import { ToastType } from 'devextreme/ui/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(DxToastComponent) toast!: DxToastComponent;

  constructor(private toastService: ToastService) {}

  ngAfterViewInit() {
    this.toastService.toastState.subscribe((toastData: any) => {
      if (toastData) {
        this.toast.instance.option('message', toastData.message);
        this.toast.instance.option('type', toastData.type);
        this.toast.instance.show();
      }
    });
  }
}
