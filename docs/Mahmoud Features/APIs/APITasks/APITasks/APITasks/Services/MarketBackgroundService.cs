using APITasks.Data;
using APITasks.Models;
using Microsoft.EntityFrameworkCore;

namespace APITasks.Services;

public class MarketBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MarketBackgroundService> _logger;
    private readonly IConfiguration _configuration;

    public MarketBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<MarketBackgroundService> logger,
        IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        var intervalMinutes = _configuration.GetValue<int>(
            "MarketProvider:PollingIntervalMinutes", 5);

        _logger.LogInformation(
            "Market background worker started. Interval: {Minutes} minutes",
            intervalMinutes);

        using var timer = new PeriodicTimer(
            TimeSpan.FromMinutes(intervalMinutes));

        // Collect data immediately when the application starts.
        do
        {
            try
            {
                await CollectMarketDataAsync(stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex, "Market data collection failed.");
            }

        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task CollectMarketDataAsync(
        CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var provider = scope.ServiceProvider
            .GetRequiredService<IMarketProviderClient>();

        var db = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var markets = await provider.GetMarketsAsync(cancellationToken);

        if (markets.Count == 0)
        {
            _logger.LogWarning("No market data received from provider.");
            return;
        }

        var snapshots = new List<MarketSnapshot>();

        foreach (var market in markets)
        {
            var coin = await db.Coins.FirstOrDefaultAsync(
                c => c.Symbol.ToLower() == market.Symbol.ToLower(),
                cancellationToken);

            if (coin == null)
            {
                coin = new Coin(
                    market.Name,
                    market.Symbol,
                    market.CurrentPrice,
                    (float)(market.Change24h ?? 0));

                db.Coins.Add(coin);
            }
            else
            {
                coin.Name = market.Name;
                coin.PriceUSD = market.CurrentPrice;
                coin.Change24h = (float)(market.Change24h ?? 0);
            }

            snapshots.Add(new MarketSnapshot
            {
                Coin = coin,
                PriceUSD = market.CurrentPrice,
                Change24h = (float)(market.Change24h ?? 0),
                CapturedAt = market.LastUpdated?.ToUniversalTime()
                    ?? DateTime.UtcNow
            });
        }

        // Save coins first so new coin IDs are generated.
        await db.SaveChangesAsync(cancellationToken);

        // Save historical market snapshots.
        db.MarketSnapshots.AddRange(snapshots);

        await db.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Successfully saved {Count} market snapshots.",
            snapshots.Count);
    }
}
