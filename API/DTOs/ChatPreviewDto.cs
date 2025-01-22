using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ChatPreviewDto
{
    [Required]
    public required MessageDto Message { get; set; }
    
    [Required]
    public required int UnreadMessagesCount { get; set; }
}