using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class PostCreateUpdateDto
{
    [Required]
    public required string Content { get; set; }
    
    public string? ImageUrl { get; set; }
    
    
    [Required]
    public required string UserId { get; set; }
    
}