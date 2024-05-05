import { Component, Input } from '@angular/core';

export enum notificationType{
  OK = 'OK',
  WARN = 'WARN',
  ERROR = 'ERROR',
  WAIT = 'WAIT',
  INFO = 'INFO',
  UNAUTH = 'UNAUTH'
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
  notificationType=notificationType.OK;
  @Input()
  message:string='';
  @Input()
  show:boolean=true;

}
