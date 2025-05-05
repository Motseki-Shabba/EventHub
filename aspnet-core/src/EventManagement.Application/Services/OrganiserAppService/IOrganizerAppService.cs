using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Application.Services;
using EventManagement.Services.OrganiserAppService.Dto;

namespace EventManagement.Services.OrganiserAppService
{
    public interface IOrganizerAppService : IAsyncCrudAppService<
    OrganizerDto, Guid, CreateOrganizerDto, OrganizerDto>
    {
        Task<OrganizerDto> GetByUserIdAsync(long userId);
        Task<List<OrganizerDto>> GetOrganizersAsync(string filter = null);
    }
}
