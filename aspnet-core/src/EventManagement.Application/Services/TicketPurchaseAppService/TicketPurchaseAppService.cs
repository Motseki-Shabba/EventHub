using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using EventManagement.Domains.TicketPurchase_Module;
using EventManagement.Domains;
using EventManagement.Services.TicketPurchaseAppService.Dto;

namespace EventManagement.Services.TicketPurchaseAppService
{
    public class TicketPurchaseAppService : ApplicationService, ITicketPurchaseAppService
    {
        private readonly TicketPurchaseManager _ticketPurchaseManager;
        private readonly IRepository<TicketPurchase, Guid> _ticketPurchaseRepository;
        private readonly IRepository<Ticket, Guid> _ticketRepository;
        private readonly IRepository<Event, Guid> _eventRepository;
        private readonly IRepository<Attendee, Guid> _attendeeRepository;
        private readonly IAbpSession _abpSession;

        public TicketPurchaseAppService(
            TicketPurchaseManager ticketPurchaseManager,
            IRepository<TicketPurchase, Guid> ticketPurchaseRepository,
            IRepository<Ticket, Guid> ticketRepository,
            IRepository<Event, Guid> eventRepository,
            IRepository<Attendee, Guid> attendeeRepository,
            IAbpSession abpSession)
        {
            _ticketPurchaseManager = ticketPurchaseManager;
            _ticketPurchaseRepository = ticketPurchaseRepository;
            _ticketRepository = ticketRepository;
            _eventRepository = eventRepository;
            _attendeeRepository = attendeeRepository;
            _abpSession = abpSession;

            LocalizationSourceName = "EventManagement";
        }

        public async Task<TicketPurchaseDto> PurchaseTicketAsync(CreateTicketPurchaseDto input)
        {
            try
            {
                // Purchase the ticket through domain manager
                var purchase = await _ticketPurchaseManager.PurchaseTicketAsync(
                    input.AttendeeId,
                    input.TicketId,
                    input.Quantity
                );

                // Get related entities for DTO
                var ticket = await _ticketRepository.GetAsync(purchase.TicketId);
                var attendee = await _attendeeRepository.GetAsync(purchase.AttendeeId);
                var @event = await _eventRepository.GetAsync(ticket.EventId);

                // Create and return DTO
                var purchaseDto = ObjectMapper.Map<TicketPurchaseDto>(purchase);
                purchaseDto.AttendeeName = $"{attendee.User.Name} {attendee.User.Surname}";
                purchaseDto.TicketName = ticket.Name;
                purchaseDto.EventId = ticket.EventId;
                purchaseDto.EventName = @event.Name;
                purchaseDto.PurchaseDate = purchase.CreationTime;

                return purchaseDto;
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("An error occurred while processing your purchase. Please try again.");
            }
        }

        public async Task<TicketPurchaseDto> CancelPurchaseAsync(CancelTicketPurchaseDto input)
        {
            try
            {
                // Cancel the purchase through domain manager
                var purchase = await _ticketPurchaseManager.CancelPurchaseAsync(input.PurchaseId);

                // Get related entities for DTO
                var ticket = await _ticketRepository.GetAsync(purchase.TicketId);
                var attendee = await _attendeeRepository.GetAsync(purchase.AttendeeId);
                var @event = await _eventRepository.GetAsync(ticket.EventId);

                // Create and return DTO
                var purchaseDto = ObjectMapper.Map<TicketPurchaseDto>(purchase);
                purchaseDto.AttendeeName = $"{attendee.User.Name} {attendee.User.Name}";
                purchaseDto.TicketName = ticket.Name;
                purchaseDto.EventId = ticket.EventId;
                purchaseDto.EventName = @event.Name;
                purchaseDto.PurchaseDate = purchase.CreationTime;

                return purchaseDto;
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("An error occurred while canceling your purchase. Please try again.");
            }
        }

        public async Task<List<TicketPurchaseDto>> GetMyPurchasesAsync()
        {
            // This method assumes the user is logged in as an attendee
            if (!_abpSession.UserId.HasValue)
                throw new UserFriendlyException("You must be logged in to view your purchases");

            // Find the attendee for the current user
            var attendee = _attendeeRepository.GetAll()
                .FirstOrDefault(a => a.UserId == _abpSession.UserId.Value);

            if (attendee == null)
                throw new UserFriendlyException("Attendee profile not found for current user");

            // Get purchases through domain manager
            var purchases = await _ticketPurchaseManager.GetPurchasesByAttendeeAsync(attendee.Id);

            // Map to DTOs with event and ticket info
            var purchaseDtos = new List<TicketPurchaseDto>();
            foreach (var purchase in purchases)
            {
                var ticket = await _ticketRepository.GetAsync(purchase.TicketId);
                var @event = await _eventRepository.GetAsync(ticket.EventId);

                var purchaseDto = ObjectMapper.Map<TicketPurchaseDto>(purchase);
                purchaseDto.AttendeeName = $"{attendee.User.Name} {attendee.User.Surname}";
                purchaseDto.TicketName = ticket.Name;
                purchaseDto.EventId = ticket.EventId;
                purchaseDto.EventName = @event.Name;
                purchaseDto.PurchaseDate = purchase.CreationTime;

                purchaseDtos.Add(purchaseDto);
            }

            return purchaseDtos;
        }

        public async Task<List<TicketPurchaseDto>> GetPurchasesByEventAsync(EntityDto<Guid> input)
        {
            // Get purchases through domain manager
            var purchases = await _ticketPurchaseManager.GetPurchasesByEventAsync(input.Id);

            // Map to DTOs with event and ticket info
            var purchaseDtos = new List<TicketPurchaseDto>();
            foreach (var purchase in purchases)
            {
                var ticket = await _ticketRepository.GetAsync(purchase.TicketId);
                var attendee = await _attendeeRepository.GetAsync(purchase.AttendeeId);
                var @event = await _eventRepository.GetAsync(ticket.EventId);

                var purchaseDto = ObjectMapper.Map<TicketPurchaseDto>(purchase);
                purchaseDto.AttendeeName = $"{attendee.User.Name}   {attendee.User.Surname}";
                purchaseDto.TicketName = ticket.Name;
                purchaseDto.EventId = ticket.EventId;
                purchaseDto.EventName = @event.Name;
                purchaseDto.PurchaseDate = purchase.CreationTime;

                purchaseDtos.Add(purchaseDto);
            }

            return purchaseDtos;
        }
    }
}
