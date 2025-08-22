import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
declare const bootstrap: any;
@Component({
  selector: 'app-higiene',
  standalone: false,
  templateUrl: './higiene.component.html',
  styleUrl: './higiene.component.css'
})
export class HigieneComponent implements OnInit {
  constructor(private service: ProductosService, 
    private serviceCarrito: CarritoService, 
    private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object) { }

  DataSourceProductos: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      let user_state = localStorage.getItem("user_state");

      if (user_state === "true") {
        this.GetHigiene();
      } else {
        this.router.navigate(['lock']);
      }
    }
  }

  GetHigiene() {
    this.service.GetHigiene().subscribe({
      next: (x) => {
        this.DataSourceProductos = x;
      },
      error: (err) => {
        console.error("Error al cargar productos de Higiene:", err);
      }
    });
  }

  InsertInCarrito(productoSeleccionado:any) {

    let producto = {
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      marca: productoSeleccionado.marca,
      precio: productoSeleccionado.precio
    }
    this.serviceCarrito.InsertInCarrito(producto).subscribe(x => {
      //this.GetCategorias();
      this.showAlertInsertCarrito('¡Tu producto fue agregado al carrito con exito!','success')
      console.log("el producto se agrego al carrito")
      //location.reload();
    },(error)=>{
      console.error("no se pudo agregar el producto al carrito", error)
    })
  }
  showAlertInsertCarrito(message: string, type: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    if (alertPlaceholder) {
      alertPlaceholder.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `  <div>${message}</div>`,
        `  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`,
        `</div>`
      ].join('');

      alertPlaceholder.append(wrapper);

      setTimeout(() => {
        const alertElement = wrapper.querySelector('.alert');
        if (alertElement) {
          const bsAlert = bootstrap.Alert.getInstance(alertElement);
          if (bsAlert) {
            bsAlert.close();
          } else {
            alertElement.remove();
          }
        }
      }, 1000);
    }
  }
}
