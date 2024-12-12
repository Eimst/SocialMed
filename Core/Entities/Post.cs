using Core.Interfaces;

namespace Core.Entities;

public class Post : BaseEntity, IDtoConvertible
{
    public string? Content { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public List<Comment> Comments { get; set; } = [];

    public List<Like> Likes { get; set; } = [];
    
    // Foreign keys
    
    public required string UserId { get; set; }
    public required UserProfile UserProfile { get; set; }
  
}