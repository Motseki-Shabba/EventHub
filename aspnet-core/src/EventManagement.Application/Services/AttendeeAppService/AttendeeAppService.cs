using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using AutoMapper;
using EventManagement.Authorization.Users;
using EventManagement.Domains;
using EventManagement.Domains.Attendee_module;
using EventManagement.Services.AttendeeAppService.DTO;
using EventManagement.Users.Dto;

namespace EventManagement.Services.AttendeeAppService
{
    public class AttendeeAppService
    : AsyncCrudAppService<Attendee, AttendeeDto, Guid, PagedAndSortedResultRequestDto, CreateAttendeeDto, AttendeeDto>,
      IAttendeeAppService
    {
        private readonly AttendeeManager _attendeeManager;

        public AttendeeAppService(
            IRepository<Attendee, Guid> repository,
            AttendeeManager attendeeManager)
            : base(repository)
        {
            _attendeeManager = attendeeManager;
        }

        public override async Task<AttendeeDto> CreateAsync(CreateAttendeeDto input)
        {
            var attendee = await _attendeeManager.CreateAsync(
                input.Name,
                input.Surname,
                input.Email,
                input.Username,
                input.Password,
                input.PhoneNumber
            );
            var res = ObjectMapper.Map<AttendeeDto>(attendee);
            return res;
        }
    }

   
}
