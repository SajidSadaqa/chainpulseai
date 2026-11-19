
using APITasks.DTOs;

namespace APITasks.Services;

public interface IMarketProviderClient
{
    Task<IReadOnlyList<CoinGeckoMarketDto>> GetMarketsAsync(
        CancellationToken cancellationToken = default);
}
