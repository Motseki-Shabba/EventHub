using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using EventManagement.Domains.Comments;
using EventManagement.Domains.Event_module;
using EventManagement.Services.CommentAppService;
using EventManagement.Services.CommentAppService.Dto;
using EventManagement.Services.EventCommentHub;
using Microsoft.AspNetCore.SignalR;

namespace EventManagement.Services.EventCommentHub
{
    public class CommentAppService : ApplicationService, ICommentAppService
    {
        private readonly EventManager _eventManager;
        private readonly IRepository<Comment, Guid> _commentRepository;
        private readonly IHubContext<EventCommentHub> _commentHubContext;

        public CommentAppService(
            EventManager eventManager,
            IRepository<Comment, Guid> commentRepository,
            IHubContext<EventCommentHub> commentHubContext)
        {
            _eventManager = eventManager;
            _commentRepository = commentRepository;
            _commentHubContext = commentHubContext;
        }

        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto input)
        {
            // Get current user info
            var userId = AbpSession.UserId ?? 0;

            // For demo purposes, you might want to get the username from somewhere
            // This could be from a user service in a real application
            string userName = "User" + userId; // Replace with actual user name from your user service

            // Create the comment using domain service
            var comment = await _eventManager.CreateCommentAsync(
                input.Text,
                input.EventId,
                userId,
                userName);

            // Map to DTO
            var commentDto = new CommentDto
            {
                Id = comment.Id,
                Text = comment.Text,
                EventId = comment.EventId,
                UserId = comment.UserId,
                UserName = comment.UserName,
                CreationTime = comment.CreationTime
            };

            // Send real-time notification via SignalR
            await _commentHubContext.Clients.Group(input.EventId.ToString())
                .SendAsync("ReceiveComment", commentDto);

            return commentDto;
        }

        public async Task<List<CommentDto>> GetEventCommentsAsync(Guid eventId)
        {
            var comments = await _eventManager.GetEventCommentsAsync(eventId);

            return comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                EventId = c.EventId,
                UserId = c.UserId,
                UserName = c.UserName,
                CreationTime = c.CreationTime
            }).ToList();
        }
    }
}
