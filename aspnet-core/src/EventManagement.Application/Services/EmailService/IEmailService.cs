using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using EventManagement.Services.EmailService.DTO;


namespace EventManagement.Services.EmailService
{
    public interface IEmailService : ITransientDependency
    {
        Task SendEmailAsync(EmailRequestDto request);
    }
}
