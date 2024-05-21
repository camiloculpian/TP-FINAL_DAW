import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NgIf],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css'
})
export class AppMenuComponent {
  public authService = inject(LoginService);
}
