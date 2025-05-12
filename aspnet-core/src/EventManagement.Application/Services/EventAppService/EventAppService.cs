using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using EventManagement.Domains.Event_module;
using EventManagement.Domains;
using EventManagement.Services.EventAppService.DTO;
using Abp.Application.Services.Dto;
using Abp.UI;

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

        public override async Task DeleteAsync(EntityDto<Guid> input)
        {
            await _eventManager.DeleteEventAsync(input.Id);
        }

        // Improved method to get event with all tickets included
        public override async Task<EventDto> GetAsync(EntityDto<Guid> input)
        {
            var @event = await _eventManager.GetAsync(input.Id);

            // Convert to DTO with all ticket information
            var eventDto = ObjectMapper.Map<EventDto>(@event);

            // Map tickets to DTOs
            eventDto.Tickets = @event.Tickets.Select(t => new TicketDto
            {
                Id = t.Id,
                Name = t.Name,
                Description = t.Description,
                Price = t.Price,
                Quantity = t.Quantity,
                RemainingQuantity = t.RemainingQuantity,
                Type = (TicketType)t.Type,
                EventId = t.EventId
            }).ToList();

            return eventDto;
        }

        // Improved method to get events by organizer ID with tickets included
        public async Task<List<EventDto>> GetEventsByOrganizerIdAsync(Guid organizerId)
        {
            // Get events from domain service
            var events = await _eventManager.GetEventsByOrganizerAsync(organizerId);

            // Map to DTOs with ticket information included
            var eventDtos = events.Select(e => {
                var dto = ObjectMapper.Map<EventDto>(e);

                // Map tickets to DTOs
                dto.Tickets = e.Tickets.Select(t => new TicketDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    Price = t.Price,
                    Quantity = t.Quantity,
                    RemainingQuantity = t.RemainingQuantity,
                    Type = (TicketType)t.Type,
                    EventId = t.EventId
                }).ToList();

                return dto;
            }).ToList();

            return eventDtos;
        }

        // Method to get all events with tickets
        public async Task<List<EventDto>> GetAllEventsWithTicketsAsync()
        {
            // Get all events from domain service
            var events = await _eventManager.GetAllAsync();

            // Map to DTOs with ticket information included
            var eventDtos = events.Select(e => {
                var dto = ObjectMapper.Map<EventDto>(e);

                // Map tickets to DTOs
                dto.Tickets = e.Tickets.Select(t => new TicketDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    Price = t.Price,
                    Quantity = t.Quantity,
                    RemainingQuantity = t.RemainingQuantity,
                    Type = (TicketType)t.Type,
                    EventId = t.EventId
                }).ToList();

                return dto;
            }).ToList();

            return eventDtos;
        }

        // Method to get all events (keeping for backward compatibility)
        public async Task<List<EventDto>> GetAllEventsAsync()
        {
            return await GetAllEventsWithTicketsAsync();
        }

        // Implement UpdateAsync method
        //public async Task<EventDto> UpdateEvent(UpdateEventDto input)
        //{
        //    // Map tickets if provided
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

        //    // Map to DTO with ticket information and return
        //    var eventDto = ObjectMapper.Map<EventDto>(@event);

        //    // Map tickets to DTOs
        //    eventDto.Tickets = @event.Tickets.Select(t => new TicketDto
        //    {
        //        Id = t.Id,
        //        Name = t.Name,
        //        Description = t.Description,
        //        Price = t.Price,
        //        Quantity = t.Quantity,
        //        RemainingQuantity = t.RemainingQuantity,
        //        Type = (TicketType)t.Type,
        //        EventId = t.EventId
        //    }).ToList();

        //    return eventDto;
        //}
        public async Task<EventDto> UpdateEvent(UpdateEventDto input)
        {
            try
            {
                // Validate the input
                if (input.Id == Guid.Empty)
                {
                    throw new UserFriendlyException("Event ID cannot be empty");
                }

                // Map tickets if provided
                List<Ticket> ticketsToUpdate = null;
                if (input.Tickets != null && input.Tickets.Any())
                {
                    ticketsToUpdate = input.Tickets.Select(t => new Ticket
                    {
                        Id = t.Id,
                        Name = t.Name ?? string.Empty,
                        Description = t.Description,
                        Price = t.Price,
                        Quantity = Math.Max(0, t.Quantity), // Ensure non-negative
                        RemainingQuantity = t.RemainingQuantity,
                        Type = (Domains.TicketType)t.Type,
                        EventId = input.Id
                    }).ToList();
                }

                // Update event using manager
                var @event = await _eventManager.UpdateEventAsync(
                    input.Id,
                    input.Name,
                    input.Description,
                    input.StartDate,
                    input.EndDate,
                    input.Location,
                    input.Price,
                    input.OrganizerIds,
                    ticketsToUpdate,
                    input.ImageUrl
                );

                // Map to DTO with ticket information and return
                var eventDto = ObjectMapper.Map<EventDto>(@event);

                // Map tickets to DTOs
                eventDto.Tickets = @event.Tickets.Select(t => new TicketDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    Price = t.Price,
                    Quantity = t.Quantity,
                    RemainingQuantity = t.RemainingQuantity,
                    Type = (TicketType)t.Type,
                    EventId = t.EventId
                }).ToList();

                return eventDto;
            }
            catch (UserFriendlyException ex)
            {
                // Re-throw user-friendly exceptions
                throw;
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "Error updating event");
                throw new UserFriendlyException("An error occurred while updating the event. Please try again.");
            }
        }



        // Optional: Create an UpdateAsync method that uses UpdateEvent
        //public override async Task<EventDto> UpdateAsync(UpdateEventDto input)
        //{
        //    return await UpdateEvent(input);
        //}
    }
}