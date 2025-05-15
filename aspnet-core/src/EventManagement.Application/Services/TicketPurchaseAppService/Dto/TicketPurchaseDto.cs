using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EventManagement.Domains.TicketPurchase_Module;

namespace EventManagement.Services.TicketPurchaseAppService.Dto
{

    [AutoMapFrom(typeof(TicketPurchase))]
    [AutoMapTo(typeof(TicketPurchase))]
    public class TicketPurchaseDto : EntityDto<Guid>
    {
        public Guid AttendeeId { get; set; }
        public string AttendeeName { get; set; }
        public Guid TicketId { get; set; }
        public string TicketName { get; set; }
        public Guid EventId { get; set; }
        public string EventName { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string TransactionId { get; set; }
        public PurchaseStatus Status { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}
