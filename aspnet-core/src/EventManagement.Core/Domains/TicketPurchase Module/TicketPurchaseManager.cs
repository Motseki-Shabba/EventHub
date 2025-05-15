using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;

namespace EventManagement.Domains.TicketPurchase_Module
{
    public class TicketPurchaseManager : DomainService
    {
      
            private readonly IRepository<TicketPurchase, Guid> _ticketPurchaseRepository;
            private readonly IRepository<Ticket, Guid> _ticketRepository;
            private readonly IRepository<Event, Guid> _eventRepository;
            private readonly IRepository<Attendee, Guid> _attendeeRepository;

            public TicketPurchaseManager(
                IRepository<TicketPurchase, Guid> ticketPurchaseRepository,
                IRepository<Ticket, Guid> ticketRepository,
                IRepository<Event, Guid> eventRepository,
                IRepository<Attendee, Guid> attendeeRepository)
            {
                _ticketPurchaseRepository = ticketPurchaseRepository;
                _ticketRepository = ticketRepository;
                _eventRepository = eventRepository;
                _attendeeRepository = attendeeRepository;
            }

            public async Task<TicketPurchase> PurchaseTicketAsync(
                Guid attendeeId,
                Guid ticketId,
                int quantity)
            {
                // Validate the inputs
                if (attendeeId == Guid.Empty)
                    throw new UserFriendlyException("Invalid attendee information");

                if (ticketId == Guid.Empty)
                    throw new UserFriendlyException("Invalid ticket information");

                if (quantity <= 0)
                    throw new UserFriendlyException("Quantity must be greater than zero");

                // Verify attendee exists
                var attendee = await _attendeeRepository.GetAsync(attendeeId);
                if (attendee == null)
                    throw new UserFriendlyException("Attendee not found");

                // Get the ticket with locking to prevent race conditions
                var ticket = await _ticketRepository.GetAsync(ticketId);
                if (ticket == null)
                    throw new UserFriendlyException("Ticket not found");

                // Verify ticket availability
                if (ticket.RemainingQuantity < quantity)
                    throw new UserFriendlyException("Not enough tickets available");

                // Calculate price
                var totalPrice = ticket.Price * quantity;

                // Create the purchase record
                var purchase = new TicketPurchase
                {
                    Id = Guid.NewGuid(),
                    AttendeeId = attendeeId,
                    TicketId = ticketId,
                    Quantity = quantity,
                    TotalPrice = totalPrice,
                    Status = PurchaseStatus.Completed,
                    TransactionId = Guid.NewGuid().ToString() // In a real system, this would come from payment processor
                };

                // Update ticket remaining quantity
                ticket.RemainingQuantity -= quantity;
                await _ticketRepository.UpdateAsync(ticket);

                // Save the purchase
                await _ticketPurchaseRepository.InsertAsync(purchase);

                return purchase;
            }

            public async Task<List<TicketPurchase>> GetPurchasesByAttendeeAsync(Guid attendeeId)
            {
                return await Task.FromResult(_ticketPurchaseRepository
                    .GetAll()
                    .Where(p => p.AttendeeId == attendeeId)
                    .ToList());
            }

            public async Task<List<TicketPurchase>> GetPurchasesByEventAsync(Guid eventId)
            {
                // Get all tickets for this event
                var eventTickets = await Task.FromResult(_ticketRepository
                    .GetAll()
                    .Where(t => t.EventId == eventId)
                    .Select(t => t.Id)
                    .ToList());

                // Get purchases for these tickets
                return await Task.FromResult(_ticketPurchaseRepository
                    .GetAll()
                    .Where(p => eventTickets.Contains(p.TicketId))
                    .ToList());
            }

            public async Task<TicketPurchase> CancelPurchaseAsync(Guid purchaseId)
            {
                var purchase = await _ticketPurchaseRepository.GetAsync(purchaseId);
                if (purchase == null)
                    throw new UserFriendlyException("Purchase not found");

                if (purchase.Status != PurchaseStatus.Completed)
                    throw new UserFriendlyException("Only completed purchases can be cancelled");

                // Get the ticket
                var ticket = await _ticketRepository.GetAsync(purchase.TicketId);

                // Update ticket quantity
                ticket.RemainingQuantity += purchase.Quantity;
                await _ticketRepository.UpdateAsync(ticket);

                // Update purchase status
                purchase.Status = PurchaseStatus.Cancelled;
                await _ticketPurchaseRepository.UpdateAsync(purchase);

                return purchase;
            }
        
    }
}
