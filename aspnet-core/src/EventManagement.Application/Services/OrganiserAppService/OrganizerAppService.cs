using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper.Internal.Mappers;
using EventManagement.Authorization.Users;
using EventManagement.Domains;
using EventManagement.Domains.Organizer_module.hrisApi.Domains.Event_Management;
using EventManagement.Services.EmailService;
using EventManagement.Services.EmailService.DTO;
using EventManagement.Services.OrganiserAppService.Dto;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;

namespace EventManagement.Services.OrganiserAppService
{
    public class OrganizerAppService : AsyncCrudAppService<
          Organizer,
          OrganizerDto,
          Guid,
          PagedAndSortedResultRequestDto,
          CreateOrganizerDto
          >
    {
        private readonly UserManager _userManager;
        private readonly OrganizerManager _organizerManager;
        private readonly EmailAppService _emailAppService;

        public OrganizerAppService(
            OrganizerManager organizerManager,
            IRepository<Organizer, Guid> repository,
            UserManager userManager,
            EmailAppService emailAppService)
            : base(repository)
        {

            _organizerManager = organizerManager;
            _userManager = userManager;
            _emailAppService = emailAppService;
        }

        public override async Task<OrganizerDto> CreateAsync(CreateOrganizerDto input)
        {
            // Check if organizer with same National ID already exists
            var existingOrganizer = await Repository.FirstOrDefaultAsync(o => o.NationalIdNumber == input.NationalIdNumber);
            if (existingOrganizer != null)
            {
                throw new UserFriendlyException("Organizer with this National ID already exists");
            }

            // Create password (could be auto-generated like in EmployeeAppService)
            string password = input.Password ?? "Default123$"; // Consider using a password generator instead

            // Create organizer using the manager
            var organizer = await _organizerManager.CreateOrganizerAsync(
                input.Name,
                input.OrganisationName,
                input.Surname,
                input.Email,
                input.Username,
                password,
                input.ProfileImageUrl,
                input.ContactInfo,
                input.NationalIdNumber,
                input.Address,
                input.EventHubAdmin
            );

            await SendOrganizerCredentialsEmail(
            input.Email,
            input.Name,
            input.Username,
            password,
            input.OrganisationName

        );

            // Map to DTO and return
            var organizerDtoReturn = ObjectMapper.Map<OrganizerDto>(organizer);

            return organizerDtoReturn;
        }

        private async Task SendOrganizerCredentialsEmail(
    string email,
    string name,
    string username,
    string password,
    string organisationName
    )
        {
            try
            {
                string emailBody = $@"
    <html>
    <body style='font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;'>
        <div style='max-width: 650px; margin: auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>
            <h2 style='color: #2c3e50; text-align: center;'>🎉 Welcome to EventHub, {name}! 🎉</h2>
            
            <p style='font-size: 16px; color: #333;'>We're thrilled to have you onboard as an organizer for <strong>{organisationName}</strong>.</p>
            
            
            
            <p style='margin-top: 25px;'>Here are your login credentials to get started:</p>
            <div style='background-color: #f0f4f8; padding: 20px; border-radius: 6px;'>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Password:</strong> {password}</p>
            </div>
            
            <p>🚀 You can now log in and start managing events, uploading images, and engaging with participants.</p>

            <p>If you need help getting started, don’t hesitate to contact our support team.</p>
            
            <p style='margin-top: 30px;'>Wishing you great success and exciting events ahead!</p>
            
            <p style='font-weight: bold;'>– The EventHub Team</p>
        </div>
    </body>
    </html>";

                var emailRequest = new EmailRequestDto
                {
                    To = email,
                    Subject = "Welcome to EventHub – Your Organizer Account Details",
                    Body = emailBody,
                    IsBodyHtml = true
                };

                await _emailAppService.SendEmail(emailRequest);

                Logger.Info($"Organizer credentials email sent successfully to: {email}");
            }
            catch (Exception ex)
            {
                Logger.Error($"Failed to send organizer credentials email: {ex.Message}", ex);
            }
        }


        public override async Task<OrganizerDto> UpdateAsync(CreateOrganizerDto input)
        {
            // Update organizer using manager
            var organizer = await _organizerManager.UpdateOrganizerAsync(
                input.Id,
                input.Surname,
                input.Email,
                input.ProfileImageUrl,
                input.ContactInfo,
                input.NationalIdNumber,
                input.Address
            );

            // Map to DTO and return
            return ObjectMapper.Map<OrganizerDto>(organizer);
        }

        public async Task<OrganizerDto> GetByUserIdAsync(long userId)
        {
            var organizer = await _organizerManager.GetByUserIdAsync(userId);
            return ObjectMapper.Map<OrganizerDto>(organizer);
        }

        public async Task<List<OrganizerDto>> GetOrganizersAsync(string filter = null)
        {
            var organizers = await _organizerManager.GetOrganizersAsync(filter);
            return ObjectMapper.Map<List<OrganizerDto>>(organizers);
        }

        //GetAll

        public override async Task<PagedResultDto<OrganizerDto>> GetAllAsync(PagedAndSortedResultRequestDto input)
        {
            var query = Repository.GetAll().Include(u => u.User).Include(e => e.Events).Include(t => t.Tickets);

            // Apply paging
            var totalCount = await query.CountAsync();
            var employees = await query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .ToListAsync();

            // Map to DTOs
            var organizerDtos = ObjectMapper.Map<List<OrganizerDto>>(employees);


            foreach (var dto in organizerDtos)
            {
                var employee = employees.First(e => e.Id == dto.Id);
                dto.Name = employee.User?.Name;
                dto.Surname = employee.User?.Surname;
                dto.Email = employee.User?.EmailAddress;
            }

            return new PagedResultDto<OrganizerDto>(totalCount, organizerDtos);
        }

    }
}
