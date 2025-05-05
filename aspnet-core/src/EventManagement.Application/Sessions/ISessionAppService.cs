using Abp.Application.Services;
using EventManagement.Sessions.Dto;
using System.Threading.Tasks;

namespace EventManagement.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
