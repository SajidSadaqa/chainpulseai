using System.ComponentModel.DataAnnotations;

namespace APITasks.Classes
{
    public class RequestProductDto
    {

        [Required(ErrorMessage = "Name is required to complete the request.")]
        [MinLength(3, ErrorMessage = "Name must contain at least 3 characters.")]
        public string Name { get; set; }

        [Range(0.1, 1000000, ErrorMessage = "Price must be greater than 0.1 .")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Department is required to complete the request.")]
        [MinLength(3,ErrorMessage = "Department must be contain at least 3 characters.")]
        public string Department { get; set; }

    };
}
