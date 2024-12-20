namespace Core.Entities;

public class Friend : BaseEntity
{
    public required string RequesterId { get; set; }
    public required UserProfile Requester { get; set; } 
    
    
    public required string ResponderId { get; set; }
    public required UserProfile Responder { get; set; }
    
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public required Status Status { get; set; }
}