using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.EventCommentHub
{
    public class CommentDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public Guid EventId { get; set; }
        public long UserId { get; set; }
        public string UserName { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
