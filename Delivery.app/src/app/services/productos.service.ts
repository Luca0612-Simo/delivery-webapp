import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  url="https://localhost:7060/api/productos/"

  constructor(private httpClient:HttpClient) { }

  GetProductos(){
    return this.httpClient.get(this.url + "GetProductos");
  }

  GetAlimentos(){
    return this.httpClient.get(this.url + "GetAlimentos");
  }

  GetHigiene(){
    return this.httpClient.get(this.url + "GetHigiene");
  }

  GetSalud(){
    return this.httpClient.get(this.url + "GetSalud");
  }

}
