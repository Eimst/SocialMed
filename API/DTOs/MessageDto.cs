using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MessageDto
{
    [Required]
    public required string Message { get; set; }
    
    [Required]
    public required UserProfileInfoDto Sender { get; set; }
    
    [Required]
    public required UserProfileInfoDto Receiver { get; set; }

    [Required] 
    public required DateTime DateCreated { get; set; }
    
    [Required] 
    public required bool IsRead { get; set; }
}