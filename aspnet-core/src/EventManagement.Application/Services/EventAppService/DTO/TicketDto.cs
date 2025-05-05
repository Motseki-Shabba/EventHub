using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using EventManagement.Domains;

namespace EventManagement.Services.EventAppService.DTO
{
    public class TicketDto : EntityDto<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int RemainingQuantity { get; set; }
        public TicketType Type { get; set; }
        public Guid EventId { get; set; }
    }
}
