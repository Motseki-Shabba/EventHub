using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventManagement.Services.CommentAppService.Dto
{
    public class CreateCommentDto
    {
        public string Text { get; set; }
        public Guid EventId { get; set; }
    }
}
