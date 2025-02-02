using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateImageDto
{
    [Required]
    public required IFormFile Image { get; set; }
}