using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Domain.Services;
using Abp.UI;
using EventManagement.Authorization.Users;

namespace EventManagement.Domains.Attendee_module
{
    public class AttendeeManager : DomainService
    {
        private readonly UserManager _userManager;
        private readonly IRepository<Attendee, Guid> _attendeeRepository;

        public AttendeeManager(UserManager userManager, IRepository<Attendee, Guid> attendeeRepository)
        {
            _userManager = userManager;
            _attendeeRepository = attendeeRepository;
        }

        public async Task<Attendee> CreateAsync(
            string name,
            string surname,
            string email,
            string username,
            string password,
            string phoneNumber)
        {
            var user = new User
            {
                Name = name,
                Surname = surname,
                EmailAddress = email,
                UserName = username,
                IsActive=true,
                //PhoneNumber = phoneNumber,
                //IsEmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                throw new UserFriendlyException("Failed to create user: " + result.Errors.JoinAsString(", "));
            }

            await _userManager.AddToRoleAsync(user, "ATTENDEE");

            var attendee = new Attendee
            {
                User = user,
                //Name = name,
                //Surname = surname,
                //Email = email,
                PhoneNumber = phoneNumber
            };
            
           var results = await _attendeeRepository.InsertAsync(attendee);
            return results;
        }
    }
}
