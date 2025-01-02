using System.Security.Claims;
using API.DTOs;
using API.Helpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class AccountController(SignInManager<AppUser> signInManager, IUnitOfWork unit) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            Email = registerDto.Email,
            UserName = registerDto.Email,
        };

        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var identityError in result.Errors)
            {
                ModelState.AddModelError(identityError.Code, identityError.Description);
            }
            return ValidationProblem();
        }

        var userProfile = new UserProfile
        {
            AppUser = user,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            UserId = user.Id
        };
        
        unit.Repository<UserProfile>().Add(userProfile);

        if (await unit.Complete())
        {
            return Ok();
        }
        
        return BadRequest("Error registering user");
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();

        return NoContent();
    }
    
    [HttpGet("info")]
    public async Task<ActionResult<UserProfileInfoDto>> GetUserInfo()
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return NoContent();
        
        var userInfo = new UserProfileInfoDto
        {
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            ProfileId = userProfile.Id,
            ProfilePictureUrl = userProfile.ProfilePictureUrl,
        };
        
        return userInfo;
    }

    [HttpGet("user-info/{userId}")]
    public async Task<ActionResult<UserProfileInfoDto>> GetUserInfo(string userId)
    {
        var userProfile = await unit.Repository<UserProfile>().GetByIdAsync(userId);
        
        if (userProfile == null)
            return NotFound("User not found");
        
        var userInfo = new UserProfileInfoDto
        {
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            ProfileId = userProfile.Id,
            ProfilePictureUrl = userProfile.ProfilePictureUrl,
        };
        
        return userInfo;
    }

    [Authorize]
    [HttpPost("profile/{userId}")]
    public async Task<ActionResult> SetProfile(string userId, UserProfileUpdateDto userProfileUpdateDto)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return Forbid();
        
        if (userId != userProfile.Id)
            return Forbid();
        
        userProfile.Bio = userProfileUpdateDto.Bio;
        userProfile.ProfilePictureUrl = userProfileUpdateDto.ProfilePictureUrl;
        
        unit.Repository<UserProfile>().Update(userProfile);
        
        if (await unit.Complete())
            return Ok();
        
        return BadRequest("Error setting profile");
    }
}