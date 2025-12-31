using Microsoft.AspNetCore.Mvc;
using MercadoPago.Config;
using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;
using Delivery_services.Repositories;
using Delivery_models;
using System.Globalization;

namespace Sistema_Delivery.Controllers
{
    [Route("api/pagos")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly iCarritoRepository _carritoService;
        private readonly IConfiguration _configuration;

        public PagosController(iCarritoRepository carritoService, IConfiguration configuration)
        {
            _carritoService = carritoService;
            _configuration = configuration;
            MercadoPagoConfig.AccessToken = _configuration["MercadoPago:AccessToken"];
        }

        public class PagoRequest
        {
            public decimal costoEnvio { get; set; }
        }


        [HttpPost("CreatePreference")]
        public async Task<IActionResult> CreatePreference([FromBody] PagoRequest data)
        {
            decimal costoEnvio = data.costoEnvio;
            try
            {
                var itemsCarrito = await _carritoService.GetCarrito();
                if (itemsCarrito == null || itemsCarrito.Count == 0)
                    return BadRequest("El carrito está vacío.");

                var client = new PreferenceClient();
                var items = new List<PreferenceItemRequest>();

                foreach (var prod in itemsCarrito)
                {
                    string precioLimpio = prod.precio.Replace("$", "").Replace(" ", "").Trim();

                    if (decimal.TryParse(precioLimpio, CultureInfo.InvariantCulture, out decimal precioParsed))
                    {
                        items.Add(new PreferenceItemRequest
                        {
                            Title = prod.nombre,
                            Quantity = 1,
                            UnitPrice = precioParsed,
                            CurrencyId = "ARS"
                        });
                    }
                }

                if (costoEnvio > 0)
                {
                    items.Add(new PreferenceItemRequest
                    {
                        Title = "Costo de Envío",
                        Quantity = 1,
                        UnitPrice = costoEnvio,
                        CurrencyId = "ARS"
                    });
                }

                var request = new PreferenceRequest
                {
                    Items = items,
                    BackUrls = new PreferenceBackUrlsRequest
                    {
                        Success = "http://localhost:4200/home/productos",
                        Failure = "http://localhost:4200/carrito",
                        Pending = "http://localhost:4200/carrito"
                    },
                    AutoReturn = null,
                    ExternalReference = "Pedido_" + DateTime.Now.Ticks.ToString()
                };

                Preference preference = await client.CreateAsync(request);
                return Ok(new { id = preference.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, detail = ex.InnerException?.Message });
            }
        }
    }
}