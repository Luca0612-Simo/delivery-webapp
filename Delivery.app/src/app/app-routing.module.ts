import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LockComponent } from './components/lock/lock.component';
import { ContainerComponent } from './components/container/container.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { AlimentosComponent } from './pages/alimentos/alimentos.component';
import { HigieneComponent } from './pages/higiene/higiene.component';
import { SaludComponent } from './pages/salud/salud.component';
import { CarritoComponent } from './pages/carrito/carrito.component';

const routes: Routes = [
  { path: '', component:LoginComponent }, 
  { path: 'lock', component: LockComponent },
  {
    path: 'home',
    component: ContainerComponent, 
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'alimentos', component: AlimentosComponent },
      { path: 'higiene', component: HigieneComponent },
      { path: 'salud', component: SaludComponent },
      { path: 'carrito', component: CarritoComponent }, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
