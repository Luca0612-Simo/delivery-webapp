using api.services.Handlers;
using Delivery_models;
using Delivery_services.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        public async Task<bool> ConfirmarPedido(Pedido pedido)
        {
            try
            {
                string queryPedido = $@"INSERT INTO Pedidos (UsuarioEmail, Total, MetodoPago, Direccion) 
                                VALUES ('{pedido.UsuarioEmail}', {pedido.Total.ToString(System.Globalization.CultureInfo.InvariantCulture)}, '{pedido.MetodoPago}', '{pedido.Direccion}');
                                SELECT last_insert_rowid();";

                var dt = SqliteHandler.GetDt(queryPedido);
                int pedidoId = Convert.ToInt32(dt.Rows[0][0]);

                foreach (var item in pedido.Items)
                {
                    string precioLimpio = item.precio.Replace("$", "").Trim();
                    string queryDetalle = $@"INSERT INTO PedidoDetalles (PedidoId, ProductoNombre, Marca, Precio) 
                                    VALUES ({pedidoId}, '{item.nombre}', '{item.marca}', {precioLimpio});";
                    SqliteHandler.GetDt(queryDetalle);
                }

                await ClearCarrito();

                return true;
            }
            catch { return false; }
        }
        public async Task<List<Pedido>> GetPedidosByUser(string email)
        {
            var listaPedidos = new List<Pedido>();
            try
            {
                string queryPedidos = $"SELECT * FROM Pedidos WHERE UsuarioEmail = '{email}' ORDER BY Fecha DESC";
                var dtPedidos = SqliteHandler.GetDt(queryPedidos);

                foreach (System.Data.DataRow row in dtPedidos.Rows)
                {
                    var pedido = new Pedido
                    {
                        Id = Convert.ToInt32(row["Id"]),
                        UsuarioEmail = row["UsuarioEmail"].ToString(),
                        Fecha = Convert.ToDateTime(row["Fecha"]),
                        Total = Convert.ToDecimal(row["Total"]),
                        MetodoPago = row["MetodoPago"].ToString(),
                        Direccion = row["Direccion"].ToString(),
                        Estado = row["Estado"].ToString(),
                        Items = new List<Carrito>()
                    };

                    string queryDetalle = $"SELECT * FROM PedidoDetalles WHERE PedidoId = {pedido.Id}";
                    var dtDetalles = SqliteHandler.GetDt(queryDetalle);

                    foreach (System.Data.DataRow dRow in dtDetalles.Rows)
                    {
                        pedido.Items.Add(new Carrito
                        {
                            nombre = dRow["ProductoNombre"].ToString(),
                            marca = dRow["Marca"].ToString(),
                            precio = dRow["Precio"].ToString()
                        });
                    }
                    listaPedidos.Add(pedido);
                }
            }
            catch (Exception ex) { Console.WriteLine(ex.Message); }
            return listaPedidos;
        }
    }
}
