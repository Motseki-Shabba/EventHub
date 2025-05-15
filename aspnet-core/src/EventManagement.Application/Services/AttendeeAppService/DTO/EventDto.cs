using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using EventManagement.Services.EventAppService.DTO;

namespace EventManagement.Services.AttendeeAppService.DTO
{
    public class EventDto : EntityDto<Guid>
    {
       
     public string Name { get; set; }
     public string Description { get; set; }
     public DateTime StartDate { get; set; }
     public DateTime EndDate { get; set; }
     public string Location { get; set; }
    public decimal Price { get; set; }
        
    public List<Guid> OrganizerIds { get; set; } = new List<Guid>();

    public List<TicketDto> Tickets { get; set; } = new List<TicketDto>();
    }
}
