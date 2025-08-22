import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
declare const bootstrap: any;
@Component({
  selector: 'app-alimentos',
  standalone: false,
  templateUrl: './alimentos.component.html',
  styleUrl: './alimentos.component.css'
})
export class AlimentosComponent implements OnInit {
  constructor(private service: ProductosService, 
    private serviceCarrito: CarritoService, 
    private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object) { }

  DataSourceProductos: any;

  ngOnInit(): void {

    if (typeof window !== 'undefined') {
      let user_state = localStorage.getItem("user_state");

      if (user_state === "true") {
        this.GetAlimentos();
      } else {
        this.router.navigate(['lock']);
      }

    }
  }
  GetAlimentos() {
    this.service.GetAlimentos().subscribe(x => {
      this.DataSourceProductos = x;
      console.log(this.DataSourceProductos);
    })
  }
  InsertInCarrito(productoSeleccionado:any) {

    let producto = {
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      marca: productoSeleccionado.marca,
      precio: productoSeleccionado.precio
    }
    this.serviceCarrito.InsertInCarrito(producto).subscribe(x => {
      this.showAlertInsertCarrito('¡Tu producto fue agregado al carrito con exito!','success')
      console.log("el producto se agrego al carrito")
      //location.reload();
    },(error)=>{
      console.error("no se pudo agregar el producto al carrito", error)
    })
  }
  showAlertInsertCarrito(message: string, type: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.log(`CarritoComponent: showAlert - No se puede mostrar alerta en entorno no-navegador: ${message}`);
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
