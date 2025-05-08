using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using EventManagement.Domains;
using EventManagement.Services.EventAppService.DTO;

namespace EventManagement.Services.EventAppService.Mapping
{
    public class EventManagementAutoMapperProfile : Profile
    {
        public EventManagementAutoMapperProfile()
        {
            // Event mapping  
            CreateMap<Event, EventDto>()
                .ForMember(dest => dest.OrganizerIds, opt => opt.MapFrom(src =>
                    src.Organizers.Select(o => o.Id)));
            CreateMap<CreateEventDto, Event>();

            // Ticket mapping  
            CreateMap<Ticket, TicketDto>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (TicketType)src.Type));
            CreateMap<CreateTicketDto, Ticket>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (Domains.TicketType)src.Type))
                .ForMember(dest => dest.RemainingQuantity, opt => opt.MapFrom(src => src.Quantity));


            CreateMap<UpdateTicketDto, Ticket>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (Domains.TicketType)src.Type));
        }
    }
}
