using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using EventManagement.Domains.Attendee_module;

namespace EventManagement.Domains
{
    public class Event : FullAuditedEntity<Guid>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; }
        public decimal Price { get; set; }
        // Navigation properties
        public virtual ICollection<Organizer> Organizers { get; set; } = new List<Organizer>();
        public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

       
    }

}
