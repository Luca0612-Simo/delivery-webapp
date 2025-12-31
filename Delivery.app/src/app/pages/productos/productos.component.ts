import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';

declare const bootstrap: any;
@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  constructor(private service: ProductosService,
    private serviceCarrito: CarritoService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  DataSourceProductos: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const status = params['status']
      const collection_status = params['collection_status'];
      const paymentId = params['payment_id'];
      if (status === 'approved' || collection_status === 'approved' || paymentId) {
        this.vaciarCarritoTrasPago();
      }
    });

    if (typeof window !== 'undefined') {
      let user_state = localStorage.getItem("user_state");
      if (user_state === "true") {
        this.GetProductos();
      } else {
        this.router.navigate(['lock']);
      }
    }
  }

  vaciarCarritoTrasPago() {
    this.serviceCarrito.ClearCarrito().subscribe({
      next: () => {
        this.showAlertInsertCarrito('¡Pago aprobado! Tu pedido fue procesado.', 'success');
        this.router.navigate([], { queryParams: { status: null }, queryParamsHandling: 'merge' });
      },
      error: (err) => console.error("Error al vaciar el carrito post-pago", err)
    });
  }


  GetProductos() {
    this.service.GetProductos().subscribe(x => {
      this.DataSourceProductos = x;
      console.log(this.DataSourceProductos);
      //this.GetCategorias();
    })
  }
  InsertInCarrito(productoSeleccionado: any) {

    let producto = {
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      marca: productoSeleccionado.marca,
      precio: productoSeleccionado.precio
    }
    this.serviceCarrito.InsertInCarrito(producto).subscribe(x => {
      //this.GetCategorias();
      this.showAlertInsertCarrito('¡Tu producto fue agregado al carrito con exito!', 'success')
      //location.reload();
    }, (error) => {
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
