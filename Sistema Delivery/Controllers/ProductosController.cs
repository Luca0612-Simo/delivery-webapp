using Delivery_models;
using Delivery_models.DTO;
using Delivery_services.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Sistema_Delivery.Controllers
{
    [Route("api/productos")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly iProductosRepository _productosService;

        public ProductosController(iProductosRepository productosService)
        {
            _productosService = productosService;
        }

        [HttpGet("GetProductos")]

        public async Task<List<ProductosDTO>> GetProductos()
        {
            var productos = await _productosService.GetProductos();

            var productosConImagen = productos.Select(p => new ProductosDTO
            {
                id = p.id,
                nombre = p.nombre,
                marca = p.marca,
                stock = p.stock,
                precio = p.precio,
                categoria_id = p.categoria_id,
                //imagen = $"/assets/img/{Uri.EscapeDataString(p.nombre)}.jpg"
                imagen = $"/assets/img/{p.imagen}"
            }).ToList();

            return productosConImagen;
        }

        [HttpGet("GetAlimentos")]
        public async Task<List<ProductosDTO>> GetAlimentos()
        {
            var productos = await _productosService.GetAlimentos();

            var productosConImagen = productos.Select(p => new ProductosDTO
            {
                id = p.id,
                nombre = p.nombre,
                marca = p.marca,
                stock = p.stock,
                precio = p.precio,
                categoria_id = p.categoria_id,
                //imagen = $"/assets/img/{Uri.EscapeDataString(p.nombre)}.jpg"
                imagen = $"/assets/img/{p.imagen}"
            }).ToList();

            return productosConImagen;
        }

        [HttpGet("GetHigiene")]
        public async Task<List<ProductosDTO>> GetHigiene()
        {
            var productos = await _productosService.GetHigiene();

            var productosConImagen = productos.Select(p => new ProductosDTO
            {
                id = p.id,
                nombre = p.nombre,
                marca = p.marca,
                stock = p.stock,
                precio = p.precio,
                categoria_id = p.categoria_id,
                //imagen = $"/assets/img/{Uri.EscapeDataString(p.nombre)}.jpg"
                imagen = $"/assets/img/{p.imagen}"
            }).ToList();

            return productosConImagen;
        }

        [HttpGet("GetSalud")]
        public async Task<List<ProductosDTO>> GetSalud()
        {
            var productos = await _productosService.GetSalud();

            var productosConImagen = productos.Select(p => new ProductosDTO
            {
                id = p.id,
                nombre = p.nombre,
                marca = p.marca,
                stock = p.stock,
                precio = p.precio,
                categoria_id = p.categoria_id,
                //imagen = $"/assets/img/{Uri.EscapeDataString(p.nombre)}.jpg"
                imagen = $"/assets/img/{p.imagen}"
            }).ToList();

            return productosConImagen;
        }

    }
}
