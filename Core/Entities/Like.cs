using Core.Interfaces;

namespace Core.Entities;

public class Like : BaseEntity, IUserProfile
{
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    
    
    // Foreign keys
    
    public required string UserId { get; set; }
    public required UserProfile UserProfile { get; set; }
    
    public required string PostId { get; set; }
    public required Post Post { get; set; }
}