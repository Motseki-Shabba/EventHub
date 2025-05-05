using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EventManagement.Services.AttendeeAppService.DTO;
using EventManagement.Users.Dto;

namespace EventManagement.Services.AttendeeAppService
{
    public interface IAttendeeAppService : IAsyncCrudAppService<AttendeeDto, Guid, PagedAndSortedResultRequestDto, CreateAttendeeDto, AttendeeDto>
    {
    }
}
