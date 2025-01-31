using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace API.DTOs;

public class UpdateImageDto
{
    [Required]
    public required IFormFile Image { get; set; }
}