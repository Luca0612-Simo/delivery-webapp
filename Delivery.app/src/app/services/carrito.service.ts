import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  url="https://localhost:7060/api/carrito/"

  constructor(private httpClient:HttpClient) { }

  GetCarrito(){
    return this.httpClient.get(this.url + "GetCarrito");
  }

  InsertInCarrito(productos:any){
    return this.httpClient.post(this.url + "InsertInCarrito", productos)
  }

  DeleteProductoInCarrito(id:any){
    return this.httpClient.delete(this.url + "DeleteProductoInCarrito?id=" + id)
  }

  ClearCarrito(){
    return this.httpClient.delete(this.url + "ClearCarrito")
  }
}
