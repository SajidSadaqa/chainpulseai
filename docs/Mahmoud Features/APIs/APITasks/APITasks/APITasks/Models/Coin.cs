using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace APITasks.Models;

[Table("coin_cards")]
public class Coin
{
    

    [Key]
    public int? ID { get; set; }

    [Display(Name = "Name")]
    [Column(TypeName="varchar(70)")]
    public string Name { get; set; }

    [Display(Name = "Symbol")]
    [Column(TypeName="varchar(20)")]
    public string Symbol { get; set; }

    [Display(Name = "Price USD")]
    [Column(TypeName="Numeric(10,4)")]
    public decimal PriceUSD { get; set; }

    [Display(Name = "Changes through 24 hour")]
    [Column(TypeName="Numeric(10,4)")]
    public float Change24h { get; set; }

    public Coin() { }

    public Coin(string _Name , string _Symbol , decimal _PriceUSD , float _Change24h) { 
        Name = _Name ;
        Symbol = _Symbol ;
        PriceUSD = _PriceUSD ;
        Change24h = _Change24h; 

    }

}
