using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class SearchDto
{
    [Required]
    public required string SearchText { get; set; }
}