
using System.ComponentModel.DataAnnotations;

namespace APITasks.DTOs;

public class CreateCoinDto
{
    [Required]
    [StringLength(70, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(20, MinimumLength = 2)]
    public string Symbol { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.0001", "999999999")]
    public decimal PriceUSD { get; set; }

    [Range(-100, 100)]
    public float Change24h { get; set; }
}
