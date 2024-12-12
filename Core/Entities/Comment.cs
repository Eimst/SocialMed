namespace Core.Entities;

public class Comment : BaseEntity
{
    public required string Text { get; set; }
    
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    
    
    // Foreign keys
    
    public required string UserId { get; set; }
    public required UserProfile UserProfile { get; set; }
    
    public required string PostId { get; set; }
    public required Post Post { get; set; }
}