using api.services.Handlers;
using Delivery_models;
using Delivery_services.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_services
{
    public class CarritoServices : iCarritoRepository
    {
        

        public async Task<List<Carrito>> GetCarrito()
        {
            string query = "select * from Carrito";
            string json = SqliteHandler.GetJson(query);

            List<Carrito> carrito = JsonConvert.DeserializeObject<List<Carrito>>(json);
            return carrito;
        }

        public async Task<bool> InsertInCarrito(Carrito carrito)
        {
            string query = $"insert into Carrito values (null, '{carrito.nombre}', '{carrito.marca}'," +
                $"'{carrito.precio}')";
            return SqliteHandler.Exec(query);
        }
        public async Task<bool> DeleteProductoInCarrito(string id)
        {
            string query = $"delete from Carrito where id = {id}";
            return SqliteHandler.Exec(query);
        }

        public async Task<bool> ClearCarrito()
        {
            string query = $"delete from Carrito";
            return SqliteHandler.Exec(query);
        }
    }
}
