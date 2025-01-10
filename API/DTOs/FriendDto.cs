
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class FriendDto
{
    [Required]
    public required UserProfileInfoDto UserProfileInfo { get; set; }
    
    [Required]
    public required string Status { get; set; }
    
    [Required]
    public DateTime DateCreated { get; set; }
}