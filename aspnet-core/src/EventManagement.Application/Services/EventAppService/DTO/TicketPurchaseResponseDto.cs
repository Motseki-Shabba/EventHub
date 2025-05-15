using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.EventAppService.DTO
{
    public class TicketPurchaseResponseDto
    {
        public bool Success { get; set; }
        public Guid TicketId { get; set; }
        public Guid EventId { get; set; }
        public string EventName { get; set; }
        public string TicketName { get; set; }
        public int Quantity { get; set; }
        public decimal PricePerTicket { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime PurchaseDate { get; set; }
        public int RemainingTickets { get; set; }
    }
}
