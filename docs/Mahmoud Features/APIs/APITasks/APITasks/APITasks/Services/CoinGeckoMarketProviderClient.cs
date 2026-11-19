
using System.Net.Http.Headers;
using System.Text.Json;
using APITasks.DTOs;

namespace APITasks.Services;

public class CoinGeckoMarketProviderClient : IMarketProviderClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<CoinGeckoMarketProviderClient> _logger;

    public CoinGeckoMarketProviderClient(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<CoinGeckoMarketProviderClient> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;

        // Identify our application to the external API.
        _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
            "ChainPulseAI/1.0");

        _httpClient.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
    }

    public async Task<IReadOnlyList<CoinGeckoMarketDto>> GetMarketsAsync(
        CancellationToken cancellationToken = default)
    {
        var coins = _configuration["MarketProvider:Coins"]
            ?? throw new InvalidOperationException(
                "Market provider coins are not configured.");

        var url =
            $"coins/markets?vs_currency=usd&ids={Uri.EscapeDataString(coins)}";

        using var response = await _httpClient.GetAsync(
            url, cancellationToken);

        var responseBody = await response.Content.ReadAsStringAsync(
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "CoinGecko returned HTTP {StatusCode}. Response: {Body}",
                (int)response.StatusCode,
                responseBody);

            throw new HttpRequestException(
                $"CoinGecko returned HTTP {(int)response.StatusCode}: {responseBody}",
                null,
                response.StatusCode);
        }

        var markets =
            JsonSerializer.Deserialize<List<CoinGeckoMarketDto>>(
                responseBody,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

        return markets
            ?? throw new InvalidOperationException(
                "CoinGecko returned an empty or invalid response.");
    }
}
