using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.SignalR;

namespace EventManagement.Services.EventCommentHub
{
    public class EventCommentHub : AbpHubBase, ITransientDependency
    {
        public EventCommentHub()
        {
        }

        public async Task SendComment(CommentDto comment)
        {
            await Clients.Group(comment.EventId.ToString()).SendAsync("ReceiveComment", comment);
        }

        public async Task JoinEventGroup(string eventId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, eventId);
        }

        public async Task LeaveEventGroup(string eventId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, eventId);
        }
    }
}
