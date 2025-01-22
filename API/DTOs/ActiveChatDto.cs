using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ActiveChatDto
{
    [Required]
    public required string UserId { get; set; }
    
    [Required]
    public required bool IsDelete { get; set; } 
}