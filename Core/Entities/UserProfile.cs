using Core.Interfaces;

namespace Core.Entities;

public class UserProfile : BaseEntity, IDtoConvertible
{
    public required string FirstName { get; set; }
    
    public required string LastName { get; set; }
    
    public string? ProfilePictureUrl { get; set; }

    public string? Bio { get; set; }

    public List<Comment> Comments { get; set; } = [];
    
    public List<Post> Posts { get; set; } = [];

    public List<Like> Likes { get; set; } = [];
    
    
    public required string UserId { get; set; } // Foreign key to IdentityUser
    public required AppUser AppUser { get; set; } // One-to-one relationship

}