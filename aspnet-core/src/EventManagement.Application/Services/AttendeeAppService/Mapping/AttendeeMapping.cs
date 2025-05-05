using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EventManagement.Domains;
using EventManagement.Services.AttendeeAppService.DTO;

namespace EventManagement.Services.AttendeeAppService.Mapping
{
    public class AttendeeMapping : Profile
    {
        public AttendeeMapping()
        {
            CreateMap<Event, EventDto>();
            CreateMap<Attendee, AttendeeDto>();
        }
    }
}
