﻿using Delivery_models;
using Delivery_services;
using Delivery_services.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Sistema_Delivery.Controllers
{
    [Route("api/carrito")]
    [ApiController]
    public class CarritoController : ControllerBase
    {
        private readonly iCarritoRepository _carritoService;

        public CarritoController(iCarritoRepository carritoService)
        {
            _carritoService = carritoService;
        }

        [HttpGet("GetCarrito")]

        public async Task<List<Carrito>> GetCarrito()
        {
            return await Task.Run(() => _carritoService.GetCarrito());
        }

        [HttpPost("InsertInCarrito")]

        public async Task<bool> InsertInCarrito(Carrito carrito)
        {
            return await Task.Run(() => _carritoService.InsertInCarrito(carrito));
        }

        [HttpDelete("DeleteProductoInCarrito")]
        public async Task<bool> DeleteProductoInCarrito(string id)
        {
            return await Task.Run(() => _carritoService.DeleteProductoInCarrito(id));
        }
        [HttpDelete("ClearCarrito")]
        public async Task<bool> ClearCarrito()
        {
            return await Task.Run(() => _carritoService.ClearCarrito());
        }
    }
}
