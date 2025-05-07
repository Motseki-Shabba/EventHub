using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using EventManagement.Domains;

namespace EventManagement.Services.OrganiserAppService.Dto
{
    [AutoMapTo(typeof(Organizer))]
    public class CreateOrganizerDto : EntityDto<Guid>
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string OrganisationName { get; set; }

        [Required]
        public string Username { get; set; }

        // Optional in DTO, will be set in service if not provided
        public string Password { get; set; }

        public string ProfileImageUrl { get; set; }

        [Required]
        [Phone]
        public string ContactInfo { get; set; }

        [Required]
        [StringLength(13, ErrorMessage = "Please make sure National ID Number is 13 digits")]
        public string NationalIdNumber { get; set; }
        public string EventHubAdmin { get; set; } = "Organizer";

        [Required]
        public string Address { get; set; }

        public string[] RoleNames { get; set; }
    }
}
