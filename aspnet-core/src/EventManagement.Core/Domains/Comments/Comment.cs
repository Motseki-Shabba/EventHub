using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace EventManagement.Domains.Comments
{
    public class Comment : FullAuditedEntity<Guid>
    {
        public virtual string Text { get; set; }
        public virtual Guid EventId { get; set; }
        public virtual Event Event { get; set; }
        public virtual long UserId { get; set; }
        public virtual string UserName { get; set; }
       
    }
}
