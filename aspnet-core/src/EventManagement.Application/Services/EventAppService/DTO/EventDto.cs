﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using EventManagement.Services.OrganiserAppService.Dto;

namespace EventManagement.Services.EventAppService.DTO
{
    public class EventDto : EntityDto<Guid>
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public string Location { get; set; }

        public decimal Price { get; set; }

        public string ImageUrl { get; set; }

        public List<Guid> OrganizerIds { get; set; } = new List<Guid>();

        public List<TicketDto> Tickets { get; set; } = new List<TicketDto>();

    }
}
