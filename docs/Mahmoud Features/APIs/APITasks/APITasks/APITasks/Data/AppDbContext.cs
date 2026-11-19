
using APITasks.Models;
using Microsoft.EntityFrameworkCore;

namespace APITasks.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Coin> Coins { get; set; }

        public DbSet<MarketSnapshot> MarketSnapshots { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MarketSnapshot>()
                .HasIndex(s => new { s.CoinId, s.CapturedAt, s.Id })
                .IsDescending(false, true, true)
                .HasDatabaseName("IX_MarketSnapshots_CoinId_CapturedAt_Id");
        }
    }
}
