using Microsoft.AspNetCore.Mvc;
using APITasks.Classes;

namespace APITasks.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {

        private static readonly List<Product> Products = new()
        {
            new Product {Id = 1 , Name = "Laptop" , Price = 3000.00m , Department= "IT"},
            new Product {Id = 2 , Name = "Book" , Price = 30.00m , Department= "Library"},
            new Product {Id = 3 , Name = "Coffee" , Price = 3.0m , Department= "CoffeeShop"}
        };

        static int NextId = 4;

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetAll() 
        {
            return Ok(Products);
        }

        [HttpGet("id:int")]
        public ActionResult<Product> GetById(int id) 
        {
            var Product = Products.FirstOrDefault(x => x.Id == id); 
            if (Product == null)
            {
                return NotFound( new { message = "Product with id {id} was Not Found."});
            }

            return Ok(Product);

        }


        [HttpPost]
        public ActionResult<Product> CreateProduct(RequestProductDto requestProduct)
        {
            var Product = new Product
            {
                Id = NextId++,
                Name = requestProduct.Name,
                Price = requestProduct.Price,
                Department = requestProduct.Department,
            };
            Products.Add(Product);

            return CreatedAtAction(nameof(GetById), new { id = Product.Id }, Product); 
        }




    }
}
