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
using EventManagement.Services.EventCommentHub;

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


        public async Task<TicketPurchaseResponseDto> PurchaseTicketsAsync(TicketPurchaseRequestDto input)
        {
            try
            {
                // Input validation
                if (input.TicketId == Guid.Empty)
                {
                    throw new UserFriendlyException("Ticket ID cannot be empty");
                }

                if (input.Quantity <= 0)
                {
                    throw new UserFriendlyException("Quantity must be greater than zero");
                }

                // Get the ticket from repository
                var ticket = await _ticketRepository.GetAsync(input.TicketId);
                if (ticket == null)
                {
                    throw new UserFriendlyException("Ticket not found");
                }

                // Check if sufficient tickets are available
                if (ticket.RemainingQuantity < input.Quantity)
                {
                    throw new UserFriendlyException($"Insufficient tickets available. Only {ticket.RemainingQuantity} tickets remaining.");
                }

                // Get the event associated with the ticket
                var @event = await Repository.GetAsync(ticket.EventId);
                if (@event == null)
                {
                    throw new UserFriendlyException("Event not found");
                }

                // Check if the event is still active
                if (@event.EndDate < DateTime.Now)
                {
                    throw new UserFriendlyException("This event has already ended");
                }

                // Update the remaining ticket quantity
                ticket.RemainingQuantity -= input.Quantity;
                await _ticketRepository.UpdateAsync(ticket);

                // Calculate the total price
                decimal totalPrice = ticket.Price * input.Quantity;

               
                // Return the purchase information
                return new TicketPurchaseResponseDto
                {
                    Success = true,
                    TicketId = ticket.Id,
                    EventId = ticket.EventId,
                    EventName = @event.Name,
                    TicketName = ticket.Name,
                    Quantity = input.Quantity,
                    PricePerTicket = ticket.Price,
                    TotalPrice = totalPrice,
                    PurchaseDate = DateTime.Now,
                    RemainingTickets = ticket.RemainingQuantity
                };
            }
            catch (UserFriendlyException)
            {
                // Re-throw user-friendly exceptions
                throw;
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "Error purchasing tickets");
                throw new UserFriendlyException("An error occurred while processing your ticket purchase. Please try again.");
            }
        }


        public async Task<EventWithCommentsDto> GetEventWithCommentsAsync(Guid eventId)
        {
            var @event = await _eventManager.GetAsync(eventId);
            var comments = await _eventManager.GetEventCommentsAsync(eventId);

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

            // Map comments to DTOs
            eventDto.Comments = comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                EventId = c.EventId,
                UserId = c.UserId,
                UserName = c.UserName,
                CreationTime = c.CreationTime
            }).ToList();

            return new EventWithCommentsDto
            {
                Event = eventDto,
                Comments = eventDto.Comments
            };
        }




    }
}