import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContainerComponent } from './components/container/container.component';

import { LockComponent } from './components/lock/lock.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { AlimentosComponent } from './pages/alimentos/alimentos.component';
import { HigieneComponent } from './pages/higiene/higiene.component';
import { SaludComponent } from './pages/salud/salud.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { MisComprasComponent } from './pages/mis-compras/mis-compras.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    LockComponent,
    LoginComponent,
    NavbarComponent,  
    ProductosComponent,
    AlimentosComponent,
    HigieneComponent,
    SaludComponent,
    CarritoComponent,
    MisComprasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
