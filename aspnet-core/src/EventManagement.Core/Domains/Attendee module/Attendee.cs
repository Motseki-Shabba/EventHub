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
    public class Attendee : FullAuditedEntity<Guid>
    {
        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        //public string Name { get; set; }
        //public string Surname { get; set; }
        //public string Email { get; set; }
        public string PhoneNumber { get; set; }
        
        //public Guid EventId { get; set; }
        // Navigation properties
        //[ForeignKey("EventId")]
        //public virtual Event Event { get; set; }
    }
   
}
