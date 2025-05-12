using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EventManagement.Services.TicketPurchaseAppService.Dto;

namespace EventManagement.Services.TicketPurchaseAppService
{
    public interface ITicketPurchaseAppService : IApplicationService
    {
        Task<TicketPurchaseDto> PurchaseTicketAsync(CreateTicketPurchaseDto input);
        Task<TicketPurchaseDto> CancelPurchaseAsync(CancelTicketPurchaseDto input);
        Task<List<TicketPurchaseDto>> GetMyPurchasesAsync();
        Task<List<TicketPurchaseDto>> GetPurchasesByEventAsync(EntityDto<Guid> input);
    }
}
