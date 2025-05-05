using Abp.Application.Services;
using EventManagement.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace EventManagement.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
