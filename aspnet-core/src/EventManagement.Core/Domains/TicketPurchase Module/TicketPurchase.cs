using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities.Auditing;

namespace EventManagement.Domains.TicketPurchase_Module
{
    public class TicketPurchase : FullAuditedEntity<Guid>
    {
        [Required]
        public Guid AttendeeId { get; set; }

        [ForeignKey("AttendeeId")]
        public virtual Attendee Attendee { get; set; }

        [Required]
        public Guid TicketId { get; set; }

        [ForeignKey("TicketId")]
        public virtual Ticket Ticket { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        public string TransactionId { get; set; }

        public PurchaseStatus Status { get; set; }
    }
    public enum PurchaseStatus
    {
        Pending = 0,
        Completed = 1,
        Cancelled = 2,
        Refunded = 3
    }

}

