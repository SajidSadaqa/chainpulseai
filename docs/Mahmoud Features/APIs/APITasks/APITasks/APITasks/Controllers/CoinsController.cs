using Microsoft.AspNetCore.Mvc;
using APITasks.Models;
using APITasks.Data;
using APITasks.DTOs;
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

            return Ok(Coin);

        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCoinDto model)
        {
            var coin = new Coin(
                model.Name,
                model.Symbol,
                model.PriceUSD,
                model.Change24h
            );

            _Context.Coins.Add(coin);
            await _Context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = coin.ID },
                coin
            );
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CreateCoinDto model)
        {
            var coin = await _Context.Coins.FindAsync(id);

            if (coin == null)
            {
                return Problem(
                    title: "Coin Not Found",
                    detail: $"Coin with ID {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound
                );
            }

            coin.Name = model.Name;
            coin.Symbol = model.Symbol;
            coin.PriceUSD = model.PriceUSD;
            coin.Change24h = model.Change24h;

            await _Context.SaveChangesAsync();

            return Ok(coin);
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


        [HttpGet("{id:int}/history")]
        public async Task<IActionResult> GetCoinHistory(
            int id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            // Validate pagination parameters.
            if (page < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest(new
                {
                    message = "Page must be at least 1 and pageSize must be between 1 and 100."
                });
            }

            // Check whether the coin exists.
            var coinExists = await _Context.Coins.AnyAsync(c => c.ID == id);

            if (!coinExists)
            {
                return NotFound(new
                {
                    message = $"Coin with ID {id} was not found."
                });
            }

            // Get total number of historical records.
            var query = _Context.MarketSnapshots
                .Where(s => s.CoinId == id);

            var totalRecords = await query.CountAsync();

            // Retrieve the requested page.
            var history = await query
                .OrderByDescending(s => s.CapturedAt)
                .ThenByDescending(s => s.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(s => new CoinHistoryDto
                {
                    Id = s.Id,
                    CoinId = s.CoinId,
                    PriceUSD = s.PriceUSD,
                    Change24h = s.Change24h,
                    CapturedAt = s.CapturedAt
                })
                .ToListAsync();

            return Ok(new
            {
                coinId = id,
                page,
                pageSize,
                totalRecords,
                totalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                data = history
            });
        }


    }
}
