using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APITasks.Models;

public class MarketSnapshot
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int CoinId { get; set; }

    [Column(TypeName = "numeric(10,4)")]
    public decimal PriceUSD { get; set; }

    [Column(TypeName = "numeric(10,4)")]
    public float Change24h { get; set; }

    public DateTime CapturedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CoinId))]
    public Coin Coin { get; set; } = null!;
}
