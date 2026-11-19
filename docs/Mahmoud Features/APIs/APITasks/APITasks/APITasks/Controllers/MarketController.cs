using APITasks.Data;
using APITasks.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace APITasks.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarketController : ControllerBase
{
    private readonly IMarketProviderClient _marketProvider;
    private readonly ILogger<MarketController> _logger;
    private readonly AppDbContext _context;

    public MarketController(
    IMarketProviderClient marketProvider,
    ILogger<MarketController> logger,
    AppDbContext context)
    {
        _marketProvider = marketProvider;
        _logger = logger;
        _context = context;
    }

    [HttpGet("live")]
    public async Task<IActionResult> GetLiveMarket(
        CancellationToken cancellationToken)
    {
        try
        {
            var markets = await _marketProvider.GetMarketsAsync(cancellationToken);
            return Ok(markets);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "CoinGecko request failed.");

            return StatusCode(503, new
            {
                message = "Market provider is currently unavailable."
            });
        }
    }


    [HttpGet("global")]
    public async Task<IActionResult> GetGlobalMarket(
        CancellationToken cancellationToken)
    {
        var totalCoins = await _context.Coins.CountAsync(cancellationToken);

        var totalPrice = await _context.Coins
            .SumAsync(c => (decimal?)c.PriceUSD, cancellationToken) ?? 0;

        var gainers = await _context.Coins
            .CountAsync(c => c.Change24h > 0, cancellationToken);

        var losers = await _context.Coins
            .CountAsync(c => c.Change24h < 0, cancellationToken);

        var averageChange = await _context.Coins
            .AverageAsync(c => (double?)c.Change24h, cancellationToken) ?? 0;

        return Ok(new
        {
            totalCoins,
            totalPriceUSD = totalPrice,
            gainers,
            losers,
            averageChange24h = Math.Round(averageChange, 2)
        });
    }


    [HttpGet("summary")]
    public async Task<IActionResult> GetMarketSummary(
        CancellationToken cancellationToken)
    {
        var totalSnapshots = await _context.MarketSnapshots
            .CountAsync(cancellationToken);

        var coinsWithSnapshots = await _context.MarketSnapshots
            .Select(s => s.CoinId)
            .Distinct()
            .CountAsync(cancellationToken);

        if (totalSnapshots == 0)
        {
            return Ok(new
            {
                totalSnapshots = 0,
                coinsWithSnapshots = 0,
                averageSnapshotPriceUSD = 0,
                highestSnapshotPriceUSD = 0,
                lowestSnapshotPriceUSD = 0,
                firstSnapshotAt = (DateTime?)null,
                latestSnapshotAt = (DateTime?)null
            });
        }

        var averagePrice = await _context.MarketSnapshots
            .AverageAsync(s => s.PriceUSD, cancellationToken);

        var highestPrice = await _context.MarketSnapshots
            .MaxAsync(s => s.PriceUSD, cancellationToken);

        var lowestPrice = await _context.MarketSnapshots
            .MinAsync(s => s.PriceUSD, cancellationToken);

        var firstSnapshot = await _context.MarketSnapshots
            .MinAsync(s => s.CapturedAt, cancellationToken);

        var latestSnapshot = await _context.MarketSnapshots
            .MaxAsync(s => s.CapturedAt, cancellationToken);

        return Ok(new
        {
            totalSnapshots,
            coinsWithSnapshots,
            averageSnapshotPriceUSD = Math.Round(averagePrice, 4),
            highestSnapshotPriceUSD = highestPrice,
            lowestSnapshotPriceUSD = lowestPrice,
            firstSnapshotAt = firstSnapshot,
            latestSnapshotAt = latestSnapshot
        });
    }



}
