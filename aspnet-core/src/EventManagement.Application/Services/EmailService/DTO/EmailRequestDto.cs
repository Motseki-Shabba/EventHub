using System.Collections.Generic;

namespace EventManagement.Services.EmailService.DTO
{
    public class EmailRequestDto
    {
        public string To { get; set; }
        public string Cc { get; set; }
        public string Bcc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsBodyHtml { get; set; } = true; // Default to HTML
        public List<EmailAttachmentDto> Attachments { get; set; } = new List<EmailAttachmentDto>();
    }
}
