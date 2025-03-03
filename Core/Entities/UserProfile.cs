using Core.Interfaces;

namespace Core.Entities;

public class UserProfile : BaseEntity, IDtoConvertible
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    
    public required string PrivateKey { get; set; }
    
    public required string PublicKey { get; set; }

    public List<Comment> Comments { get; set; } = [];
    public List<Post> Posts { get; set; } = [];
    public List<Like> Likes { get; set; } = [];
    
    public List<Friend> SentFriendRequests { get; set; } = [];
    public List<Friend> ReceivedFriendRequests { get; set; } = [];
    
    public required string UserId { get; set; } // Foreign key to IdentityUser
    public required AppUser AppUser { get; set; } // One-to-one relationship

}