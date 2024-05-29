import { HeaderComponent } from '../../shared/header/header.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NgModule } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,NgbCarouselModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  images = [
  'https://s1.1zoom.me/b4147/86/Keyboard_Toys_Macro_Closeup_Laptops_Police_520947_1920x1080.jpg',
  'https://www.utu.edu.uy/sites/www.utu.edu.uy/files/styles/styles_galeria/public/generico/imagenes/2020-11/reparacion-pc.jpg?h=453af878&itok=eJYtAewE',
  'https://wallpapers.com/images/featured/laptop-murjp1nk4lp1idlt.jpg'
];
}
