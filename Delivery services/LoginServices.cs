using api.services.Handlers;
using Delivery_models;
using Delivery_models.DTO;
using Delivery_services.Repositories;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_services
{
    public class LoginServices : iLoginRepository
    {
        public async Task<List<Login>> GetUsers()
        {
            string query = "select * from Login";
            string json = SqliteHandler.GetJson(query);
            List<Login> list = JsonConvert.DeserializeObject<List<Login>>(json);
            return list;
        }

        public async Task<LoginResultDTO> Login(LoginDTO login)
        {
            string query = $"select count(*) as Existe from Login where Usuario = '{login.Usuario}' and Clave = '{login.Clave}' ";
            string resultado = SqliteHandler.GetScalar(query); //necisto seguir validando, por eso usar un getjson es mas engorroso que usar un getscalar

            LoginResultDTO loginResult = new LoginResultDTO();

            if (resultado == "0")
            {
                loginResult.Result = false;
                loginResult.Mensaje = "Credenciales invalidas o usuario inexistente";

            }
            else
            {
                query = $"select Estado from Login where Usuario = '{login.Usuario}' and Clave = '{login.Clave}'";
                resultado = SqliteHandler.GetScalar(query);

                if (resultado != "V")
                {
                    loginResult.Result = false;
                    loginResult.Mensaje = "Usuario no vigente";
                }
                else
                {
                    query = $"update Login set FechaUltLogin = '{DateTime.Now.ToString()}'where Usuario = '{login.Usuario}'";
                    bool result = SqliteHandler.Exec(query);

                    if (result)
                    {
                        loginResult.Result = true;
                        loginResult.Mensaje = "Usuario validado correctamente";
                    }
                    else
                    {
                        loginResult.Result = false;
                        loginResult.Mensaje = "Ocurrio un error, comunicarse con el administrador";
                    }


                }
            }
            return loginResult;
        }
    }
}
