﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;

namespace EventManagement.Domains.Event_module
{
    public class EventManager : DomainService
    {
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Organizer, Guid> _organizerRepository;
        private readonly IRepository<Ticket, Guid> _ticketRepository;

        public EventManager(
            IRepository<Event, Guid> eventRepository,
            IRepository<Organizer, Guid> organizerRepository,
            IRepository<Ticket, Guid> ticketRepository)
        {
            _eventRepository = eventRepository;
            _organizerRepository = organizerRepository;
            _ticketRepository = ticketRepository;
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
            return await _eventRepository.GetAllListAsync();
        }

        public async Task<List<Event>> GetEventsByOrganizerAsync(Guid organizerId)
        {
            var organizer = await _organizerRepository.GetAsync(organizerId);
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
            var @event = await _eventRepository.GetAsync(eventId);
            if (@event == null)
            {
                throw new UserFriendlyException("Event not found");
            }

            // Update properties if provided
            if (!string.IsNullOrEmpty(name)) @event.Name = name;
            if (!string.IsNullOrEmpty(description)) @event.Description = description;
            if (startDate.HasValue) @event.StartDate = startDate.Value;
            if (endDate.HasValue) @event.EndDate = endDate.Value;
            if (!string.IsNullOrEmpty(location)) @event.Location = location;
            if (price.HasValue) @event.Price = price.Value;

            // Validate dates
            if (@event.StartDate >= @event.EndDate)
            {
                throw new UserFriendlyException("End date must be after start date");
            }

            // Update organizers if provided
            if (organizerIds != null && organizerIds.Any())
            {
                // Clear existing organizers
                @event.Organizers.Clear();

                // Add new organizers
                foreach (var organizerId in organizerIds)
                {
                    var organizer = await _organizerRepository.GetAsync(organizerId);
                    if (organizer == null)
                    {
                        throw new UserFriendlyException($"Organizer with ID {organizerId} not found");
                    }
                    @event.Organizers.Add(organizer);
                }
            }

            // Update tickets if provided
            if (tickets != null)
            {
                // Remove existing tickets (or update in a more sophisticated implementation)
                foreach (var existingTicket in @event.Tickets.ToList())
                {
                    await _ticketRepository.DeleteAsync(existingTicket.Id);
                    @event.Tickets.Remove(existingTicket);
                }

                // Add new tickets
                foreach (var ticket in tickets)
                {
                    ticket.EventId = @event.Id;
                    ticket.RemainingQuantity = ticket.Quantity;
                    @event.Tickets.Add(ticket);
                    await _ticketRepository.InsertAsync(ticket);
                }
            }

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
    }
}

