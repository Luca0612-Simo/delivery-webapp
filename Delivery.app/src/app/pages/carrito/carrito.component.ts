import { Component, OnInit, AfterViewInit, NgZone, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

declare const google: any;
declare const bootstrap: any;

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

  selectedPaymentMethod: string = 'Efectivo'; 

  id: any;
  nombre: any;
  marca: any;
  precio: any;

  cardHolderName: string = '';
  cardNumber: string = '';
  cardExpiration: string = '';
  cardCvv: string = '';

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      let user_state = localStorage.getItem("user_state");
      if (user_state === "true") {
        this.GetCarrito();
      } else {
        this.router.navigate(['lock']);
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
    const Costo = 20.00;
    return this.calculateSubtotal() + Costo;
  }

  private validateCardFields(): boolean {
    if (!this.cardHolderName.trim()) {
      this.showAlert('Por favor, ingrese el nombre del titular de la tarjeta.', 'danger');
      return false;
    }
    if (!/^\d{16}$/.test(this.cardNumber.replace(/\s/g, ''))) {
      this.showAlert('Por favor, ingrese un número de tarjeta válido (16 dígitos).', 'danger');
      return false;
    }

    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!expDateRegex.test(this.cardExpiration)) {
      this.showAlert('Por favor, ingrese una fecha de vencimiento válida (MM/YYYY).', 'danger');
      return false;
    }
    const [monthStr, yearStr] = this.cardExpiration.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; 

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.showAlert('La fecha de vencimiento no puede ser pasada.', 'danger');
      return false;
    }

    if (!/^\d{3,4}$/.test(this.cardCvv)) {
      this.showAlert('Por favor, ingresa un CVV válido (3 o 4 dígitos).', 'danger');
      return false;
    }
    return true;
  }

  ConfirmarCompra(): void {
    if (!this.DataSourceProductos || this.DataSourceProductos.length === 0) {
      this.showAlert('No podes finalizar la compra. Tu carrito está vacío.', 'danger');
      return; 
    }

    if (this.selectedPaymentMethod === 'Tarjeta') {
      if (!this.validateCardFields()) {
        return; 
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('MetodoDePago'); 
      if (modalElement) {
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
    this.ClearCarrito();

    this.showAlert('¡Compra realizada con éxito! Su pedido está en camino. Serás redirigido al catálogo en 3 segundos.', 'success');

    setTimeout(() => {
      this.ngZone.run(() => {
        this.router.navigate(['home/productos']);
      });
    }, 3000);
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
