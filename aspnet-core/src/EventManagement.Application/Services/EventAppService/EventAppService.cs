using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper.Internal.Mappers;
using EventManagement.Domains.Event_module;
using EventManagement.Domains;
using EventManagement.Services.EventAppService.DTO;
using Abp.Application.Services.Dto;

namespace EventManagement.Services.EventAppService
{
    public class EventAppService : AsyncCrudAppService<
           Event,
           EventDto,
           Guid,
           PagedAndSortedResultRequestDto,
           CreateEventDto
         >, IEventAppService
    {
        private readonly EventManager _eventManager;
        private readonly IRepository<Organizer, Guid> _organizerRepository;
        private readonly IRepository<Ticket, Guid> _ticketRepository;

        public EventAppService(
            EventManager eventManager,
            IRepository<Event, Guid> repository,
            IRepository<Organizer, Guid> organizerRepository,
            IRepository<Ticket, Guid> ticketRepository)
            : base(repository)
        {
            _eventManager = eventManager;
            _organizerRepository = organizerRepository;
            _ticketRepository = ticketRepository;

            LocalizationSourceName = "EventManagement";
        }

        public async Task<EventDto> CreateEvent(CreateEventDto input)
        {
            // Map tickets from DTOs to entities
            var tickets = input.Tickets.Select(t => new Ticket
            {
                Name = t.Name,
                Description = t.Description,
                Price = t.Price,
                Quantity = t.Quantity,
                RemainingQuantity = t.Quantity,
                Type = (Domains.TicketType)t.Type
            }).ToList();

            // Create event using the event manager
            var @event = await _eventManager.CreateEventAsync(
                input.Name,
                input.Description,
                input.StartDate,
                input.EndDate,
                input.Location,
                input.Price,
                input.OrganizerIds,
                tickets,
                input.ImageUrl
            );

            // Map to DTO and return
            return ObjectMapper.Map<EventDto>(@event);
        }

        public override async Task<EventDto> CreateAsync(CreateEventDto input)
        {
            return await CreateEvent(input);
        }

        //public async Task<EventDto> UpdateEvent(EventDto input)
        //{
        //    // Get the original event first
        //    var originalEvent = await Repository.GetAsync(input.Id);

        //    // Prepare tickets to update if any
        //    List<Ticket> ticketsToUpdate = null;
        //    if (input.Tickets != null && input.Tickets.Any())
        //    {
        //        ticketsToUpdate = input.Tickets.Select(t => new Ticket
        //        {
        //            Id = t.Id,
        //            Name = t.Name,
        //            Description = t.Description,
        //            Price = t.Price,
        //            Quantity = t.Quantity,
        //            RemainingQuantity = t.RemainingQuantity,
        //            Type = (Domains.TicketType)t.Type,
        //            EventId = input.Id
        //        }).ToList();
        //    }

        //    // Update event using manager
        //    var @event = await _eventManager.UpdateEventAsync(
        //        input.Id,
        //        input.Name,
        //        input.Description,
        //        input.StartDate,
        //        input.EndDate,
        //        input.Location,
        //        input.Price,
        //        input.OrganizerIds,
        //        ticketsToUpdate,
        //        input.ImageUrl
        //    );

        //    // Map to DTO and return
        //    return ObjectMapper.Map<EventDto>(@event);
        //}

        //public override async Task<EventDto> UpdateAsync(EventDto input)
        //{
        //    return await UpdateEvent(input);
        //}

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await _eventManager.DeleteEventAsync(input.Id);
        }

        public override async Task<EventDto> GetAsync(EntityDto<Guid> input)
        {
            var @event = await _eventManager.GetAsync(input.Id);
            return ObjectMapper.Map<EventDto>(@event);
        }

        public async Task<List<EventDto>> GetEventsByOrganizerIdAsync(Guid organizerId)
        {
            var events = await _eventManager.GetEventsByOrganizerAsync(organizerId);
            return ObjectMapper.Map<List<EventDto>>(events);
        }

        //GetAll including tickets
        public async Task<List<EventDto>> GetAllEventsAsync()
        {
            var events = await _eventManager.GetAllAsync();
            return ObjectMapper.Map<List<EventDto>>(events);
        }
        public async Task<List<EventDto>> GetAllEventsWithTicketsAsync()
        {
            var events = await _eventManager.GetAllAsync();
            return ObjectMapper.Map<List<EventDto>>(events);


        }
    }
}
