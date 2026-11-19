namespace APITasks.DTOs;

public class CoinHistoryDto
{
    public int Id { get; set; }

    public int CoinId { get; set; }

    public decimal PriceUSD { get; set; }

    public float Change24h { get; set; }

    public DateTime CapturedAt { get; set; }
}