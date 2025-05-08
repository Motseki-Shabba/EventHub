using System.Linq;
using System;
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


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        // Force all DateTime and DateTime? to be treated as UTC

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {

            foreach (var property in entityType.GetProperties()

                .Where(p => p.ClrType == typeof(DateTime) || p.ClrType == typeof(DateTime?)))

            {

                property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(

                    v => v.Kind == DateTimeKind.Utc ? v : v.ToUniversalTime(),

                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc)

                ));

            }

        }


    }


}
