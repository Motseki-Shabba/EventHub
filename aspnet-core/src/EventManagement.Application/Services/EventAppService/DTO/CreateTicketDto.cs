using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.EventAppService.DTO
{
    public class CreateTicketDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public TicketType Type { get; set; }
    }

    public enum TicketType
    {
        General = 0,
        VIP = 1,
        EarlyBird = 2
    }
}
