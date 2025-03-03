using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class PostDto
{
    [Required]
    public required string Id { get; set; }

    public string? Content { get; set; }

    public string? ImageUrl { get; set; }


    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public List<CommentDto>? Comments { get; set; }

    public List<LikeDto>? Likes { get; set; }

    [Required] 
    public required string UserId { get; set; }

    [Required] 
    public required UserProfileInfoDto UserProfile { get; set; }
}