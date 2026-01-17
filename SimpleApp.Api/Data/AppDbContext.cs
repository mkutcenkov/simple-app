using Microsoft.EntityFrameworkCore;
using SimpleApp.Api.Models;

namespace SimpleApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<City> Cities { get; set; }
}
