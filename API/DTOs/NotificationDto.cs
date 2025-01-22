

using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class NotificationDto
{
    [Required]
    public required string Id { get; set; }
    
    [Required]
    public required UserProfileInfoDto Initiator { get; set; }
    
    [Required]
    public required DateTime Date { get; set; }
    
    [Required]
    public required string Text { get; set; }
}