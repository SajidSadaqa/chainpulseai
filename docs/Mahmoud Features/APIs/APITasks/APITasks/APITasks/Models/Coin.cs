using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace APITasks.Models;

[Table("Coin")]
public class Coin
{
    

    [Key]
    public int ID { get; set; }

    [Required]
    [Column(TypeName = "varchar(70)")]
    [StringLength(70, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Column(TypeName="varchar(20)")]
    [StringLength(20, MinimumLength = 2)]
    public string Symbol { get; set; } = string.Empty;

    [Column(TypeName="Numeric(10,4)")]
    [Range(typeof(decimal), "0.0001", "999999999")]
    public decimal PriceUSD { get; set; }

    [Column(TypeName="Numeric(10,4)")]
    [Range(-100, 100)]
    public float Change24h { get; set; }

    public Coin() { }

    public Coin(string _Name , string _Symbol , decimal _PriceUSD , float _Change24h) { 
        Name = _Name ;
        Symbol = _Symbol ;
        PriceUSD = _PriceUSD ;
        Change24h = _Change24h; 

    }

}
