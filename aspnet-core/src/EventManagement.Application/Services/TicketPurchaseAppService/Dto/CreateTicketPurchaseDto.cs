using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.TicketPurchaseAppService.Dto
{
    public class CreateTicketPurchaseDto
    {
        public Guid AttendeeId { get; set; }
        public Guid TicketId { get; set; }
        public int Quantity { get; set; }
    }
}
