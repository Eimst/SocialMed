using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserProfileDto
{
    [Required]
    public string FirstName { get; set; }
    
    [Required]
    public string LastName { get; set; }
    
    public string? ProfilePictureUrl { get; set; }
}