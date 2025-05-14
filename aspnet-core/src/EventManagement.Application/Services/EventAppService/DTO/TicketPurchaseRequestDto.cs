using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.EventAppService.DTO
{
    public class TicketPurchaseRequestDto
    {
        public Guid TicketId { get; set; }
        public int Quantity { get; set; }
    }
}
