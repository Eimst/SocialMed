using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CommentCreateDto
{
    [Required]
    public required string Text { get; set; }
    
    [Required]
    public required string UserId { get; set; }
}