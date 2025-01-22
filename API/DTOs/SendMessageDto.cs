using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs;

public class SendMessageDto
{
    [Required]    
    public required string Message { get; set; }
}