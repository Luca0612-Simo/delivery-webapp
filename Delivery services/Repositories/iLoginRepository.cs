using Delivery_models.DTO;
using Delivery_models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Delivery_services.Repositories
{
    public interface iLoginRepository
    {
        public Task<List<Login>> GetUsers();
        public Task<LoginResultDTO> Login(LoginDTO login);
    }
}
