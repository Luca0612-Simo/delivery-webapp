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
    public class ProductosServices : iProductosRepository
    {
        public async Task<List<Productos>> GetProductos()
        {
            string query = "select * from Productos";
            string json = SqliteHandler.GetJson(query);

            List<Productos> productos = JsonConvert.DeserializeObject<List<Productos>>(json);
            return productos;
        }
        public async Task<List<Productos>> GetAlimentos()
        {
            string query = "select * from Productos where categoria_id = 1";
            string json = SqliteHandler.GetJson(query);

            List<Productos> alimentos = JsonConvert.DeserializeObject<List<Productos>>(json);
            return alimentos;
        }

        public async Task<List<Productos>> GetHigiene()
        {
            string query = "select * from Productos where categoria_id = 2";
            string json = SqliteHandler.GetJson(query);

            List<Productos> higiene = JsonConvert.DeserializeObject<List<Productos>>(json);
            return higiene;
        }

        public async Task<List<Productos>> GetSalud()
        {
            string query = "select * from Productos where categoria_id = 3";
            string json = SqliteHandler.GetJson(query);

            List<Productos> salud = JsonConvert.DeserializeObject<List<Productos>>(json);
            return salud;
        }
    }
}
