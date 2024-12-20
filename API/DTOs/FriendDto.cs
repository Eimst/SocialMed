
using System.ComponentModel.DataAnnotations;
using Core.Entities;

namespace API.DTOs;

public class FriendDto
{
    [Required]
    public required UserProfileInfoDto UserProfileInfoDto { get; set; }
    
    [Required]
    public required string Status { get; set; }
    
    [Required]
    public DateTime DateCreated { get; set; }
}