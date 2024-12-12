using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LikeCreateDto
{
    [Required]
    public required string UserId { get; set; }
}