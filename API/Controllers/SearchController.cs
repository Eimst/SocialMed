using API.DTOs;
using API.Extensions;
using API.Helpers;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController(IUnitOfWork unit) : ControllerBase
{
    [HttpGet]
    public async Task<List<UserProfileInfoDto>> SearchForPerson([FromQuery] SearchDto searchDto)
    {
        var nameParts = searchDto.SearchText.Split(" ", StringSplitOptions.RemoveEmptyEntries);

        var firstName = nameParts.Length > 0 ? nameParts[0] : string.Empty;
        var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;
        
        var userProfiles = await unit.Repository<UserProfile>().GetListAsync();

        var currentUserId = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        var personSearchService = new PersonSearchService();
        var similarPeople = personSearchService.SearchForPerson(firstName, lastName, currentUserId?.Id, userProfiles);

        return similarPeople.Select(u => u.ToDto()).ToList();
    }
}