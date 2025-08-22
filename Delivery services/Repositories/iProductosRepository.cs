using Delivery_models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_services.Repositories
{
    public interface iProductosRepository
    {
        public Task<List<Productos>> GetProductos();
        public Task<List<Productos>> GetAlimentos();
        public Task<List<Productos>> GetSalud();
        public Task<List<Productos>> GetHigiene();
    }
}
