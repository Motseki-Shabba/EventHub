using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace EventManagement.EntityFrameworkCore;

public static class EventManagementDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<EventManagementDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<EventManagementDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
