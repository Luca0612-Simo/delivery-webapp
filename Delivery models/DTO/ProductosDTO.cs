using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_models.DTO
{
    public class ProductosDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string marca { get; set; }
        public string stock { get; set; }
        public string precio { get; set; }
        public int categoria_id { get; set; }

        public string imagen { get; set; }
    }
}
