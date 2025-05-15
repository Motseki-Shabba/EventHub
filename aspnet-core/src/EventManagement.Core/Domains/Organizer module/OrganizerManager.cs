namespace EventManagement.Domains.Organizer_module
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Abp.Domain.Repositories;
    using Abp.Domain.Services;
    using Abp.UI;
    using EventManagement.Authorization.Users;
    using Microsoft.EntityFrameworkCore;

    namespace hrisApi.Domains.Event_Management
    {
        public class OrganizerManager : DomainService
        {
            private readonly UserManager _userManager;
            private readonly IRepository<Organizer, Guid> _organizerRepository;
            private readonly IRepository<Event, Guid> _eventRepository;
            private readonly IRepository<Ticket, Guid> _ticketRepository;



            public OrganizerManager(
                UserManager userManager,
                IRepository<Organizer, Guid> organizerRepository,
                IRepository<Event, Guid> eventRepository,
                IRepository<Ticket, Guid> ticketRepository)
            {
                _userManager = userManager;
                _organizerRepository = organizerRepository;
                _eventRepository = eventRepository;
                _ticketRepository = ticketRepository;
            }

            public async Task<Organizer> CreateOrganizerAsync(
                string firstName,
                string OrganisationName,
                string surname,
                string emailAddress,
                string username,
                string password,
                string profileImageUrl,
                string contactInfo,
                string nationalIdNumber,
                string address,
                string EventHubAdmin)
            {
                var user = new User
                {
                    Name = firstName,
                    Surname = surname,
                    EmailAddress = emailAddress,
                    UserName = username,
                    IsActive = true
                };

                var userCreationResult = await _userManager.CreateAsync(user, password);
                if (!userCreationResult.Succeeded)
                {
                    throw new UserFriendlyException("User creation failed",
                        string.Join(", ", userCreationResult.Errors.Select(e => e.Description)));
                }

                if(EventHubAdmin == "EventHubAdmin")
                {
                    await _userManager.AddToRoleAsync(user, "EventHubAdmin");
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, "Organizer");
                }
               
               



                var organizer = new Organizer
                {
                    UserId = user.Id,
                    OrganisationName = OrganisationName,
                    ProfileImageUrl = profileImageUrl,
                    ContactInfo = contactInfo,
                    NationalIdNumber = nationalIdNumber,
                    Address = address,

                };

                await _organizerRepository.InsertAsync(organizer);

                return organizer;
            }

            public async Task<Organizer> GetByUserIdAsync(long userId)
            {
                var organizer = await _organizerRepository.FirstOrDefaultAsync(o => o.UserId == userId);
                if (organizer == null)
                {
                    throw new UserFriendlyException("Organizer not found");
                }
                return organizer;
            }

            public async Task<Organizer> GetAsync(Guid id)
            {
                var organizer = await _organizerRepository.GetAsync(id);
                if (organizer == null)
                {
                    throw new UserFriendlyException("Organizer not found");
                }
                return organizer;
            }

            public async Task<Organizer> GetByIdAsync(Guid id)
            {
                var organizer = await _organizerRepository.GetAsync(id);
                if (organizer == null)
                {
                    throw new UserFriendlyException("Organizer not found");
                }

                // Verify that the associated user exists
                var user = await _userManager.GetUserByIdAsync(organizer.UserId);
                if (user == null)
                {
                    throw new UserFriendlyException("Associated user record not found");
                }

                return organizer;
            }

            public async Task<Organizer> UpdateOrganizerAsync(
                Guid id,
                string surname = null,
                string email = null,
                string profileImageUrl = null,
                string contactInfo = null,
                string nationalIdNumber = null,
                string address = null)
            {
                // Get the organizer
                var organizer = await _organizerRepository.GetAsync(id);
                if (organizer == null)
                {
                    throw new UserFriendlyException("Organizer not found");
                }

                // Update organizer properties
                if (!string.IsNullOrEmpty(profileImageUrl)) organizer.ProfileImageUrl = profileImageUrl;
                if (!string.IsNullOrEmpty(contactInfo)) organizer.ContactInfo = contactInfo;
                if (!string.IsNullOrEmpty(nationalIdNumber)) organizer.NationalIdNumber = nationalIdNumber;
                if (!string.IsNullOrEmpty(address)) organizer.Address = address;

                await _organizerRepository.UpdateAsync(organizer);

                var user = await _userManager.GetUserByIdAsync(organizer.UserId);
                if (user == null)
                {
                    throw new UserFriendlyException("Associated user record not found");
                }

                if (!string.IsNullOrEmpty(surname)) user.Surname = surname;
                if (!string.IsNullOrEmpty(email)) user.EmailAddress = email;

                await _userManager.UpdateAsync(user);

                return organizer;
            }

            public async Task<List<Organizer>> GetAllAsync()
            {
                
                return await _organizerRepository.GetAll().ToListAsync();
            }

            public Task<List<Organizer>> GetOrganizersAsync(string filter = null)
            {
                return GetOrganizersAsync(_organizerRepository, filter);
            }

            public async Task<List<Organizer>> GetOrganizersAsync(IRepository<Organizer, Guid> _organizerRepository, string filter = null)
            {
                // Use GetAllAsync to fetch the queryable collection asynchronously  
                var organizersQuery = await _organizerRepository.GetAllAsync();

                // Include related entities using LINQ's Include and ThenInclude  
                var organizersWithDetails = await organizersQuery
                    .Include(e => e.Events)
                    .ThenInclude(t => t.Tickets)
                    .ToListAsync();

                // Apply the filter if provided  
                return organizersWithDetails.Where(o =>
                    string.IsNullOrEmpty(filter) ||
                    o.NationalIdNumber.Contains(filter) ||
                    o.ContactInfo.Contains(filter) ||
                    o.Address.Contains(filter)
                ).ToList();
            }

           
        }
    }
}
