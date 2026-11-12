using Microsoft.AspNetCore.Mvc;
using APITasks.Models;
using APITasks.Data;
using Microsoft.EntityFrameworkCore;

namespace APITasks.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoinsController : Controller
    {
        private readonly AppDbContext _Context;
        public CoinsController(AppDbContext Context) { 
            _Context = Context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Coin>>> GetAll()
        {
            var Coin = await _Context.Coins.ToListAsync();
            
            return Ok(Coin);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult> GetById(int id)
        {

            var Coin = await _Context.Coins.FindAsync(id);
            if (Coin == null)
            {
                return NotFound(new { message = $"Coin with id {id} was Not Found." });
            }

            return Problem(
            title: "Coin Not Found",
            detail: $"Coin with ID {id} was not found.",
            statusCode: StatusCodes.Status404NotFound
);

        }

        [HttpPost]
        public async Task<IActionResult> Create(Coin model)
        {
            var Coin = new Coin( model.Name, model.Symbol, model.PriceUSD, model.Change24h);
            _Context.Coins.Add(Coin);
            await _Context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = Coin.ID }, Coin);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Coin model)
        {
            var Coin = await _Context.Coins.FindAsync(id);

            if (Coin == null)
            {
                return Problem(
                title: "Coin Not Found",
                detail: $"Coin with ID {id} was not found.",
                statusCode: StatusCodes.Status404NotFound
                );
            }


            Coin.Name = model.Name;
            Coin.Symbol = model.Symbol;
            Coin.PriceUSD = model.PriceUSD;
            Coin.Change24h = model.Change24h;

            await _Context.SaveChangesAsync();
            
            return Ok(Coin);

        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Remove(int id)
        {

            var Coin = await _Context.Coins.FindAsync(id);
            if (Coin == null)
            {
                return Problem(
                title: "Coin Not Found",
                detail: $"Coin with ID {id} was not found.",
                statusCode: StatusCodes.Status404NotFound
                );
            }

            _Context.Coins.Remove(Coin);

            await _Context.SaveChangesAsync();
            return Ok(Coin);
        }


    }
}
