using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using EventManagement.Authorization.Users;

namespace EventManagement.Domains
{
    public class Organizer : FullAuditedEntity<Guid>
    {

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        public string OrganisationName { get; set; }
        public string ProfileImageUrl { get; set; }
        public string ContactInfo { get; set; }
        public string NationalIdNumber { get; set; } = string.Empty;
        public string Address { get; set; }
      
        // Navigation properties
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();

        public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();



    }
}
