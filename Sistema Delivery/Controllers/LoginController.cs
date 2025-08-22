using Delivery_models.DTO;
using Delivery_models;
using Delivery_services.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Sistema_Delivery.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly iLoginRepository _LoginService;

        public LoginController(iLoginRepository LoginService)
        {
            _LoginService = LoginService;
        }

        [HttpGet("GetUsers")]
        public async Task<List<Login>> GetUsers()
        {
            return await Task.Run(() => _LoginService.GetUsers());

        }

        [HttpPost("Login")]
        public async Task<LoginResultDTO> Login(LoginDTO login)
        {
            Console.WriteLine($"Usuario: {login.Usuario}, Pass: {login.Clave}");
            return await Task.Run(() => _LoginService.Login(login));

        }
    }
}
