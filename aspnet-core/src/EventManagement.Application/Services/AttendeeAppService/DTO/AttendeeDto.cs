using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EventManagement.Authorization.Users;
using EventManagement.Domains;

namespace EventManagement.Services.AttendeeAppService.DTO
{
    [AutoMap(typeof(Attendee))]
    public class AttendeeDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public User User { get; set; }
    }

}
