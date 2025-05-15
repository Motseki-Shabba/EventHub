using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace EventManagement.EntityFrameworkCore;

public static class EventManagementDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<EventManagementDbContext> builder, string connectionString)
    {
        //builder.UseSqlServer(connectionString);
        builder.UseNpgsql(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<EventManagementDbContext> builder, DbConnection connection)
    {
        //builder.UseSqlServer(connection);
        builder.UseNpgsql(connection);
    }
}
