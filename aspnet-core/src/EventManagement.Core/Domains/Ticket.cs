using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace EventManagement.Domains
{
    public class Ticket : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public int RemainingQuantity { get; set; }
        public TicketType Type { get; set; }

        // Foreign key for Event
        public Guid EventId { get; set; }
        public virtual Event Event { get; set; }
    }

    public enum TicketType
    {
        General = 0,
        VIP = 1,
        EarlyBird = 2,
        
    }
}

