using System.ComponentModel.DataAnnotations;
using Core.Entities;

namespace API.DTOs;

public class LikeDto
{
    public DateTime DateCreated { get; set; }
    
    [Required]
    public required string UserId { get; set; }
    
    [Required]
    public required UserProfileDto UserProfile { get; set; }
    
    [Required]
    public required string PostId { get; set; }
}