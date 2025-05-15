using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using EventManagement.Services.CommentAppService.Dto;
using EventManagement.Services.EventCommentHub;

namespace EventManagement.Services.CommentAppService
{
    public interface ICommentAppService : IApplicationService
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentDto input);
        Task<List<CommentDto>> GetEventCommentsAsync(Guid eventId);
    }
}
