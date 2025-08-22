using Delivery_models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_services.Repositories
{
    public interface iCarritoRepository
    {
        public Task<List<Carrito>> GetCarrito();
        public Task<bool> InsertInCarrito(Carrito carrito);
        public Task<bool> DeleteProductoInCarrito(string id);
        public Task<bool> ClearCarrito();
    }
}
