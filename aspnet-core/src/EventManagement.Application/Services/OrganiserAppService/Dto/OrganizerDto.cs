using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EventManagement.Domains;
using EventManagement.Services.EventAppService.DTO;

namespace EventManagement.Services.OrganiserAppService.Dto
{
    [AutoMapFrom(typeof(Organizer))]
    [AutoMapTo(typeof(Organizer))]
    [AutoMap(typeof(Organizer))]
    public class OrganizerDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string ProfileImageUrl { get; set; }
        public string ContactInfo { get; set; }
        public string NationalIdNumber { get; set; }
        public string OrganisationName { get; set; }
        public string Password { get; set; }

        public string Surname { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }

        public virtual List<EventDto> Events { get; set; } 

    }
}
