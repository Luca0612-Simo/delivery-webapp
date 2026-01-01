import { Component, OnInit, AfterViewInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

declare const google: any;
declare const bootstrap: any;
declare var MercadoPago: any;

@Component({
  selector: 'app-carrito',
  standalone: false,
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit, AfterViewInit {
  constructor(
    private service: CarritoService,
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  DataSourceProductos: any[] = [];
  selectedProduct: any;
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;
  geocoder: google.maps.Geocoder | undefined;
  address: string = '';
  selectedLocation: { lat: number, lng: number, address: string } | undefined;
  isMapModalOpen: boolean = true;
  isDeliverySelected: boolean = false;
  deliveryFee: number = 1500;
  minAmountForDelivery: number = 10000;

  selectedPaymentMethod: string = 'Efectivo';

  id: any;
  nombre: any;
  marca: any;
  precio: any;

  mp : any;

  onPagarMercadoPago() {
    const costoEnvio = this.isDeliverySelected ? this.deliveryFee : 0;

    this.service.createPreference(costoEnvio).subscribe({
      next: (res: any) => {
        this.mp.checkout({
          preference: {
            id: res.id
          },
          autoOpen: true
        });
      },
      error: (err) => {
        console.error("Error detallado del servidor:", err);
        this.showAlert('Error al conectar con Mercado Pago', 'danger');
      }
    });
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      let user_state = localStorage.getItem("user_state");
      if (user_state === "true") {
        this.GetCarrito();
        this.initMercadoPago();
      } else {
        this.router.navigate(['lock']);
      }
    }
  }

  initMercadoPago() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof MercadoPago !== 'undefined') {
        this.mp = new MercadoPago('APP_USR-d25d536a-2fb9-47ef-92a9-a20c4e0d0f38', {
          locale: 'es-AR'
        });
      } else {
        setTimeout(() => this.initMercadoPago(), 500);
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('Mapa');
      if (modalElement) {
        modalElement.addEventListener('shown.bs.modal', () => {
          this.ngZone.run(() => {
            setTimeout(() => {
              this.initMap();
            }, 100);
          });
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
          this.ngZone.run(() => {
            this.isMapModalOpen = false;
            this.map = undefined;
            this.marker = undefined;
            this.selectedLocation = undefined;
            this.address = '';
          });
        });

      }
    }
  }

  openMapModal(): void {
    this.isMapModalOpen = true;
  }

  closeMapModal(): void {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('Mapa');
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  initMap(): void {
    console.log("CarritoComponent: google.maps existe:", typeof google !== 'undefined' && google.maps);

    const mapDiv = document.getElementById('map');

    if (isPlatformBrowser(this.platformId) && typeof google !== 'undefined' && google.maps && mapDiv) {
      console.log("CarritoComponent: Requisitos para inicializar mapa cumplidos. mapDiv:", mapDiv);

      if (this.map) {
        google.maps.event.trigger(this.map, 'resize');

        let centerPosition: google.maps.LatLngLiteral;

        if (this.marker && typeof this.marker.getPosition === 'function') {
          const latLngObject = this.marker.getPosition();
          if (latLngObject) {
            centerPosition = { lat: latLngObject.lat(), lng: latLngObject.lng() };
          } else {
            centerPosition = { lat: -34.6037, lng: -58.3816 };
          }
        } else {
          centerPosition = { lat: -34.6037, lng: -58.3816 };
        }
        this.map.setCenter(centerPosition);
        return;
      }

      const initialLatLng = { lat: -34.6037, lng: -58.3816 };

      this.map = new google.maps.Map(mapDiv, {
        center: initialLatLng,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false
      });
      console.log("CarritoComponent: Mapa creado exitosamente.");

      this.geocoder = new google.maps.Geocoder();
      console.log("CarritoComponent: Geocoder inicializado.");

      this.map!.addListener('click', (event: any) => {
        this.ngZone.run(() => {
          this.placeMarkerAndGeocode(event.latLng);
        });
      });

      if (this.selectedLocation) {
        this.placeMarker(new google.maps.LatLng(this.selectedLocation.lat, this.selectedLocation.lng));
        this.map!.setCenter(new google.maps.LatLng(this.selectedLocation.lat, this.selectedLocation.lng));
      }

    } else {
      console.error('Google Maps API no cargada o elemento del mapa no encontrado. Verifique index.html y si el modal está abierto.');
      if (!mapDiv && isPlatformBrowser(this.platformId)) {
        console.error("Detalle: El div del mapa (id='map') es undefined. Asegúrese de que el *ngIf='isMapModalOpen' esté funcionando y el elemento esté en el DOM.");
      }
      if (typeof google === 'undefined' || !google.maps) {
        console.error("Detalle: El objeto 'google' o 'google.maps' no está disponible. La API de Google Maps podría no haberse cargado.");
      }
    }
  }

  placeMarker(location: google.maps.LatLng): void {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP
    });
    this.map?.setCenter(location);
  }

  placeMarkerAndGeocode(location: google.maps.LatLng): void {
    this.placeMarker(location);

    if (this.geocoder) {
      this.geocoder.geocode({ 'location': location }, (results: any, status: any) => {
        this.ngZone.run(() => {
          if (status === 'OK' && results[0]) {
            this.selectedLocation = {
              lat: location.lat(),
              lng: location.lng(),
              address: results[0].formatted_address
            };
            this.address = results[0].formatted_address;
          } else {
            console.error('CarritoComponent: Geocodificación inversa fallida debido a: ' + status);
            this.selectedLocation = undefined;
          }
        });
      });
    }
  }

  searchAddress(): void {
    if (!this.geocoder || !this.address.trim()) {
      console.warn("CarritoComponent: Geocoder no inicializado o dirección vacía.");
      return;
    }

    this.geocoder.geocode({ 'address': this.address }, (results: any, status: any) => {
      this.ngZone.run(() => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          this.placeMarker(location);
          this.map?.setCenter(location);
          this.selectedLocation = {
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          };
        } else {
          console.error('CarritoComponent: Geocodificación de dirección fallida debido a: ' + status);
          this.selectedLocation = undefined;
        }
      });
    });
  }

  GetCarrito() {
    this.service.GetCarrito().subscribe({
      next: (x: any) => {
        this.DataSourceProductos = x;
      },
      error: (error) => {
        console.error("CarritoComponent: Error al cargar el carrito:", error);
      }
    });
  }

  ClearCarrito(): void {
    this.service.ClearCarrito().subscribe({
      next: () => {
        this.DataSourceProductos = [];
      },
      error: (error) => {
        console.error("CarritoComponent: Error al vaciar el carrito:", error);
      }
    });
  }

  SetProducto(producto: any) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.marca = producto.marca;
    this.precio = producto.precio;
    this.selectedProduct = producto;
  }

  DeleteProductoInCarrito() {
    if (!this.selectedProduct || typeof this.selectedProduct.id === 'undefined') {
      return;
    }

    this.service.DeleteProductoInCarrito(this.selectedProduct.id).subscribe({
      next: (response) => {
        this.GetCarrito();
        const modalElement = document.getElementById('DeleteProducto');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      },
      error: (error) => {
        console.error("CarritoComponent: Error al eliminar el producto del carrito:", error);
      }
    });
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    if (this.DataSourceProductos && this.DataSourceProductos.length > 0) {
      for (let item of this.DataSourceProductos) {
        subtotal += parseFloat(item.precio || 0);
      }
    }
    return subtotal;
  }

  calculateTotal(): number {
    let total = this.calculateSubtotal();

    if (this.isDeliverySelected && this.calculateSubtotal() >= this.minAmountForDelivery) {
      total += this.deliveryFee;
    }

    return total;
  }

  

  ConfirmarCompra(): void {
  const nuevoPedido = {
    usuarioEmail: localStorage.getItem('user_email'), // Asegúrate de guardar el email al loguear
    total: this.calculateTotal(),
    metodoPago: this.selectedPaymentMethod,
    direccion: this.address, // La que viene del mapa
    items: this.DataSourceProductos
  };

  this.service.ConfirmarPedido(nuevoPedido).subscribe({
    next: () => {
      this.showAlert('¡Pedido registrado! Lo estamos preparando.', 'success');
      this.router.navigate(['home/productos']);
    },
    error: () => this.showAlert('Hubo un error al procesar tu pedido', 'danger')
  });
}

  showAlert(message: string, type: string): void {
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
      }, 5000);
    }
  }

}
