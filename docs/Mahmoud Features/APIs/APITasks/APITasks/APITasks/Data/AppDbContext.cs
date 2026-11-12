
using APITasks.Models;
using Microsoft.EntityFrameworkCore;

namespace APITasks.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { 
        }

        public DbSet<Coin> Coins { get; set; }

        public DbSet<MarketSnapshot> MarketSnapshots { get; set; }

    }
}
