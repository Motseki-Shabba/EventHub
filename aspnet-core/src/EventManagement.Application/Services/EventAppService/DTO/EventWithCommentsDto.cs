using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EventManagement.Services.EventCommentHub;

namespace EventManagement.Services.EventAppService.DTO
{
    public class EventWithCommentsDto
    {
        public EventDto Event { get; set; }
        public List<CommentDto> Comments { get; set; }
    }
}
