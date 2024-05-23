import { Component } from '@angular/core';
import { NgbNavModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuCollapsed = true;
}