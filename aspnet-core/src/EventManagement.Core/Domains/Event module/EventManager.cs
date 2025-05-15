using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.Runtime.Session;
using Abp.UI;
using EventManagement.Domains.Comments;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.Domains.Event_module
{
    public class EventManager : DomainService
    {
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Organizer, Guid> _organizerRepository;
        private readonly IRepository<Ticket, Guid> _ticketRepository;
        private readonly IRepository<Comment, Guid> _commentRepository;

        public EventManager(
            IRepository<Event, Guid> eventRepository,
            IRepository<Organizer, Guid> organizerRepository,
            IRepository<Comment, Guid> commentRepository,
            IRepository<Ticket, Guid> ticketRepository)
        {
            _eventRepository = eventRepository;
            _organizerRepository = organizerRepository;
            _ticketRepository = ticketRepository;
            _commentRepository = commentRepository;
        }

        public async Task<Event> CreateEventAsync(
            string name,
            string description,
            DateTime startDate,
            DateTime endDate,
            string location,
            decimal price,
            List<Guid> organizerIds,
            List<Ticket> tickets,
            string imageUrl = null)
        {
            // Validate organizers exist
            foreach (var organizerId in organizerIds)
            {
                var organizer = await _organizerRepository.GetAsync(organizerId);
                if (organizer == null)
                {
                    throw new UserFriendlyException($"Organizer with ID {organizerId} not found");
                }
            }

            // Validate dates
            if (startDate >= endDate)
            {
                throw new UserFriendlyException("End date must be after start date");
            }

            if (startDate < DateTime.Now)
            {
                throw new UserFriendlyException("Start date cannot be in the past");
            }

            // Validate tickets
            if (tickets == null || !tickets.Any())
            {
                throw new UserFriendlyException("At least one ticket must be created for the event");
            }

            // Create event
            var newEvent = new Event
            {
                Name = name,
                Description = description,
                StartDate = startDate,
                EndDate = endDate,
                Location = location,
                Price = price,
                ImageUrl = imageUrl,
                Tickets = new List<Ticket>()
            };

            // Insert event first to get ID
            await _eventRepository.InsertAsync(newEvent);

            // Associate organizers
            foreach (var organizerId in organizerIds)
            {
                var organizer = await _organizerRepository.GetAsync(organizerId);
                newEvent.Organizers.Add(organizer);
                organizer.Events.Add(newEvent);
            }

            // Add tickets to the event
            foreach (var ticket in tickets)
            {
                ticket.EventId = newEvent.Id;
                ticket.RemainingQuantity = ticket.Quantity;
                newEvent.Tickets.Add(ticket);
                await _ticketRepository.InsertAsync(ticket);
            }

            return newEvent;
        }

        public async Task<Event> GetAsync(Guid id)
        {
            var @event = await _eventRepository.GetAsync(id);
            if (@event == null)
            {
                throw new UserFriendlyException("Event not found");
            }
            return @event;
        }

        public async Task<List<Event>> GetAllAsync()
        {
            return await _eventRepository.GetAllIncluding(t => t.Tickets, o => o.Organizers).ToListAsync();
        }

        public async Task<List<Event>> GetEventsByOrganizerAsync(Guid organizerId)
        {
            //include events with their tickets and organizers
            var organizer = await _organizerRepository.GetAll().Include(o => o.Events).ThenInclude(e => e.Tickets).FirstOrDefaultAsync(o => o.Id == organizerId);
           
            if (organizer == null)
            {
                throw new UserFriendlyException("Organizer not found");
            }

            return organizer.Events.ToList();
        }

       
        public async Task<Event> UpdateEventAsync(
        Guid eventId,
         string name = null,
   string description = null,
   DateTime? startDate = null,
   DateTime? endDate = null,
   string location = null,
   decimal? price = null,
   List<Guid> organizerIds = null,
   List<Ticket> tickets = null,
   string imageUrl = null)
        {
            // Validate input
            if (startDate.HasValue && endDate.HasValue && startDate.Value >= endDate.Value)
            {
                throw new UserFriendlyException("End date must be after start date");
            }

            var @event = await _eventRepository.GetAsync(eventId);
            if (@event == null)
            {
                throw new UserFriendlyException($"Event with ID {eventId} not found");
            }

            // Update properties if provided  
            if (!string.IsNullOrEmpty(name)) @event.Name = name;
            if (!string.IsNullOrEmpty(description)) @event.Description = description;
            if (startDate.HasValue) @event.StartDate = startDate.Value;
            if (endDate.HasValue) @event.EndDate = endDate.Value;
            if (!string.IsNullOrEmpty(location)) @event.Location = location;
            if (price.HasValue) @event.Price = price.Value;
            //if (!string.IsNullOrEmpty(imageUrl)) @event.ImageUrl = imageUrl;

            // Re-validate after applying changes
            if (@event.StartDate >= @event.EndDate)
            {
                throw new UserFriendlyException("End date must be after start date");
            }

            // Update organizers if provided  
            if (organizerIds != null && organizerIds.Any())
            {
                var validOrganizerIds = new List<Guid>();

                // Verify organizers exist before modifying relationships
                foreach (var organizerId in organizerIds)
                {
                    var organizer = await _organizerRepository.GetAsync(organizerId);
                    if (organizer == null)
                    {
                        throw new UserFriendlyException($"Organizer with ID {organizerId} not found");
                    }
                    validOrganizerIds.Add(organizerId);
                }

                // Clear existing organizers  
                @event.Organizers.Clear();

                // Add new organizers  
                foreach (var organizerId in validOrganizerIds)
                {
                    var organizer = await _organizerRepository.GetAsync(organizerId);
                    @event.Organizers.Add(organizer);
                }
            }

            // Update tickets if provided  
            if (tickets != null && tickets.Any())
            {
                // Create dictionary of existing tickets for easy lookup
                var existingTicketsDict = @event.Tickets.ToDictionary(t => t.Id);
                var newTicketIds = new HashSet<Guid>();

                foreach (var inputTicket in tickets)
                {
                    // Validate ticket data
                    if (inputTicket.Quantity < 0)
                    {
                        throw new UserFriendlyException($"Ticket quantity cannot be negative for ticket {inputTicket.Name}");
                    }

                    // Handle remaining quantity logic
                    if (inputTicket.RemainingQuantity < 0 ||
                        inputTicket.RemainingQuantity > inputTicket.Quantity)
                    {
                        inputTicket.RemainingQuantity = inputTicket.Quantity;
                    }

                    // Ensure ticket has an event ID
                    inputTicket.EventId = @event.Id;

                    // Process ticket based on whether it exists
                    if (inputTicket.Id != Guid.Empty && existingTicketsDict.TryGetValue(inputTicket.Id, out var existingTicket))
                    {
                        // Update existing ticket
                        existingTicket.Name = inputTicket.Name;
                        existingTicket.Description = inputTicket.Description;
                        existingTicket.Price = inputTicket.Price;
                        existingTicket.Quantity = inputTicket.Quantity;
                        existingTicket.RemainingQuantity = inputTicket.RemainingQuantity;
                        existingTicket.Type = inputTicket.Type;

                        await _ticketRepository.UpdateAsync(existingTicket);
                        newTicketIds.Add(existingTicket.Id);
                    }
                    else
                    {
                        // Create new ticket
                        if (inputTicket.Id == Guid.Empty)
                        {
                            inputTicket.Id = Guid.NewGuid();
                        }

                        @event.Tickets.Add(inputTicket);
                        await _ticketRepository.InsertAsync(inputTicket);
                        newTicketIds.Add(inputTicket.Id);
                    }
                }

                // Remove tickets that weren't included in the update
                foreach (var ticket in @event.Tickets.ToList())
                {
                    if (!newTicketIds.Contains(ticket.Id))
                    {
                        @event.Tickets.Remove(ticket);
                        await _ticketRepository.DeleteAsync(ticket.Id);
                    }
                }
            }

            // Save changes
            await _eventRepository.UpdateAsync(@event);
            return @event;
        }




        public async Task DeleteEventAsync(Guid eventId)
        {
            var @event = await _eventRepository.GetAsync(eventId);
            if (@event == null)
            {
                throw new UserFriendlyException("Event not found");
            }

            // Remove associations with organizers
            foreach (var organizer in @event.Organizers.ToList())
            {
                organizer.Events.Remove(@event);
            }
            @event.Organizers.Clear();

            // Delete associated tickets
            foreach (var ticket in @event.Tickets.ToList())
            {
                await _ticketRepository.DeleteAsync(ticket.Id);
            }
            @event.Tickets.Clear();

            await _eventRepository.DeleteAsync(eventId);
        }

        // Add new method to create a comment
        public async Task<Comment> CreateCommentAsync(
            string text,
            Guid eventId,
            long userId,
            string userName)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(text))
            {
                throw new UserFriendlyException("Comment text cannot be empty");
            }

            // Check if event exists
            var @event = await _eventRepository.GetAsync(eventId);
            if (@event == null)
            {
                throw new UserFriendlyException("Event not found");
            }

            // Create and save the comment
            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Text = text,
                EventId = eventId,
                UserId = userId,
                UserName = userName,
                
            };

            await _commentRepository.InsertAsync(comment);

            return comment;
        }

        // Add method to get comments for an event
        public async Task<List<Comment>> GetEventCommentsAsync(Guid eventId)
        {
            return await Task.FromResult(
                _commentRepository.GetAll()
                .Where(c => c.EventId == eventId)
                .OrderByDescending(c => c.CreationTime)
                .ToList());
        }
    }
}

