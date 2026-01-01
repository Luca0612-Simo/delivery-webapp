// Pedido.cs
namespace Delivery_models
{
    public class Pedido
    {
        public int Id { get; set; }
        public string UsuarioEmail { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }
        public string MetodoPago { get; set; }
        public string Direccion { get; set; }
        public string? Estado { get; set; } = "Pendiente";
        public List<Carrito> Items { get; set; } 
    }
}