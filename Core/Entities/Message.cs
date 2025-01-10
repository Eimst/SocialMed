namespace Core.Entities;

public class Message : BaseEntity
{
    public required string SenderId { get; set; }

    public required string ReceiverId { get; set; }

    public required string EncryptedMessageForSender  { get; set; }
    
    public required string EncryptedMessageForReceiver  { get; set; }

    public DateTime DateCreated { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; }

    public required UserProfile Sender { get; set; }

    public required UserProfile Receiver { get; set; }
}