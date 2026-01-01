import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-mis-compras',
  standalone: false,
  templateUrl: './mis-compras.component.html',
  styleUrl: './mis-compras.component.css'
})
export class MisComprasComponent implements OnInit {
  misPedidos: any[] = [];

  constructor(private service: CarritoService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.service.getPedidos(email).subscribe(res => {
        this.misPedidos = res;
      });
    }
  }
}