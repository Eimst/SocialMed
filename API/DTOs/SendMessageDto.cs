using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SendMessageDto
{
    [Required]    
    public required string Message { get; set; }
}