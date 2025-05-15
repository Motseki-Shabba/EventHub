using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EventManagement.Domains;

namespace EventManagement.Services.EventAppService.DTO
{
    [AutoMapTo(typeof(Event))]
    public class UpdateEventDto : EntityDto<Guid>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Location { get; set; }

        public decimal? Price { get; set; }

        public string ImageUrl { get; set; }

        public List<Guid> OrganizerIds { get; set; }

        public List<UpdateTicketDto> Tickets { get; set; }
    }
}
