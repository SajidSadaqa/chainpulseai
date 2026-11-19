
using APITasks.Services;
using Microsoft.AspNetCore.Mvc;

namespace APITasks.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarketController : ControllerBase
{
    private readonly IMarketProviderClient _marketProvider;
    private readonly ILogger<MarketController> _logger;

    public MarketController(
        IMarketProviderClient marketProvider,
        ILogger<MarketController> logger)
    {
        _marketProvider = marketProvider;
        _logger = logger;
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
}
