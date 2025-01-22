namespace Core.Entities;

public class Notification : BaseEntity
{
    public required string OwnerId { get; set; }
    
    public required string InitiatorId { get; set; }
    
    public required DateTime Date { get; set; } = DateTime.UtcNow;
    
    public required string Text { get; set; }
    
    public required bool isDeleted { get; set; }
    
    public required UserProfile Initiator { get; set; }
}