import { Component, Input } from '@angular/core';

export enum notificationStatus{
  OK= 'OK',
  ERROR= 'ERROR',
  WARN= 'WARN',
  INFO= 'INFO',
  UNAUTH= 'UNAUTH',
  WAIT= 'WAIT'
}

@Component({
  selector: 'app-notify',
  standalone: true,
  imports: [],
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css'
})
export class NotifyComponent {
  @Input()
  status=status?status:notificationStatus.INFO;
  @Input()
  title='';
  @Input()
  message:string='';
  @Input()
  show:boolean=true;
}
