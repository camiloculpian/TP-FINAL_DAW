import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotifyComponent } from './components/notify/notify.component';;
import { HomeComponent } from './pages/home/home.component';
import { ModalComponent } from './components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NotifyComponent,HomeComponent,ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend DAW';
  // El Usuario Actual
  currentUser={};
}
