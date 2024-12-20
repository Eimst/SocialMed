using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserProfileInfoDto
{
    [Required]
    public required string FirstName { get; set; }
    
    [Required]
    public required string LastName { get; set; }
    
    [Required]
    public required string ProfileId { get; set; }
    
    public string? ProfilePictureUrl { get; set; }
}