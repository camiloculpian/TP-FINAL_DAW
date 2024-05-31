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
  imports: [HeaderComponent, FooterComponent, NgbCarouselModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  testimonials = [
    {
      quote: "¡Compuexpress salvó mi computadora! Pensé que había perdido todo, pero lograron recuperar mis archivos y mi computadora funciona mejor que nunca.",
      author: "Homero Simpson",
      image: "https://i.pinimg.com/originals/26/47/3a/26473aeb0510191272951312d6a3a70c.jpg",
      rating: 5
    },
    {
      quote: "El servicio de Compuexpress fue excelente. Fueron rápidos y eficientes, y ahora mi computadora funciona como nueva. ¡Gracias!",
      author: "Marge Simpson",
      image: "https://i.pinimg.com/564x/84/84/19/848419b365d4c421bbcb44a28b4d596b.jpg",
      rating: 5
    },
    {
      quote: "Recomiendo totalmente a Compuexpress. Tuvieron mi PC lista en menos de un día y no tuve que gastar una fortuna. ¡Grandes profesionales!",
      author: "Lisa Simpson",
      image: "https://i.pinimg.com/originals/0c/21/44/0c2144dce9add8529a30517efcbd36c8.jpg",
      rating: 5
    },
    {
      quote: "¡Increíble servicio! Compuexpress arregló mi computadora en tiempo récord. Ahora puedo seguir jugando sin problemas.",
      author: "Bart Simpson",
      image: "https://i.pinimg.com/originals/6f/e8/b1/6fe8b18d4ad105fcdc4b7c7a2f124926.png",
      rating: 3
    },
    {
      quote: "Estaba preocupada por mi computadora, pero Compuexpress la arregló rápidamente. Son muy confiables y profesionales.",
      author: "Maggie Simpson",
      image: "https://i.pinimg.com/736x/38/7c/67/387c676a9a0b98c3d88f216ca6b6e13b.jpg",
      rating: 5
    }
  ];

  generateArray(length: number): any[] {
    return Array(length);
  }
}
