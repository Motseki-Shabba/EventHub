using Abp.Zero.EntityFrameworkCore;
using EventManagement.Authorization.Roles;
using EventManagement.Authorization.Users;
using EventManagement.Domains;
using EventManagement.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.EntityFrameworkCore;

public class EventManagementDbContext : AbpZeroDbContext<Tenant, Role, User, EventManagementDbContext>
{
    /* Define a DbSet for each entity of the application */

    //dbset for Organizer
    public DbSet<Organizer> Organizers { get; set; }
    //dbset for Event
    public DbSet<Event> Events { get; set; }

    //dbset for Ticket
    public DbSet<Ticket> Tickets { get; set; }

    //dbset for Attendee

    public DbSet<Attendee> Attendees { get; set; }


    public EventManagementDbContext(DbContextOptions<EventManagementDbContext> options)
        : base(options)
    {
    }
}
