using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CommentDto
{
    [Required]
    public required string Id { get; set; }
    
    [Required]
    public required string Text { get; set; }
    
    public DateTime DateCreated { get; set; }
    
    [Required]
    public required string UserId { get; set; }
    
    [Required]
    public required string PostId { get; set; }
    
    [Required]
    public required UserProfileDto UserProfile { get; set; }
}