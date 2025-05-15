using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using EventManagement.Services.EventAppService.DTO;

namespace EventManagement.Services.EventAppService
{
    public interface IEventAppService : IAsyncCrudAppService<
        EventDto, Guid, PagedAndSortedResultRequestDto, CreateEventDto>
    {
        Task<List<EventDto>> GetEventsByOrganizerIdAsync(Guid organizerId);
        Task<EventDto> CreateEvent(CreateEventDto input);
        Task<EventDto> UpdateEvent(UpdateEventDto input);

      

        Task<List<EventDto>> GetAllEventsWithTicketsAsync();

        Task<List<EventDto>> GetAllEventsAsync();

        Task<TicketPurchaseResponseDto> PurchaseTicketsAsync(TicketPurchaseRequestDto input);
    }

}
