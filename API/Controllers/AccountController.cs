
using API.DTOs;
using API.Helpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(
    SignInManager<AppUser> signInManager,
    IUnitOfWork unit,
    IHybridEncryptionService hybridEncryptionService,
    UserManager<AppUser> userManager,
    IPrivateKeyCache privateKeyCache,
    IHybridDecryptionService hybridDecryptionService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var result = await signInManager.PasswordSignInAsync(user, loginDto.Password, false, false);

        if (!result.Succeeded)
        {
            return Unauthorized("Invalid email or password.");
        }

        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (userProfile == null)
        {
            await signInManager.SignOutAsync();
            return StatusCode(500, "User could not be validated, try logging in again.");
        }

        string decryptedPrivateKey;
        try
        {
            decryptedPrivateKey =
                await hybridDecryptionService.DecryptEncryptedPrivateKey(userProfile.PrivateKey, user.Id);
        }
        catch (Exception ex)
        {
            await signInManager.SignOutAsync();
            return StatusCode(500,
                $"An error occurred while validating your profile. Please try logging in again.");
        }

        privateKeyCache.StorePrivateKey(user.Id, decryptedPrivateKey);

        return Ok();
    }

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
            var errorMessage = string.Join("\n\n", result.Errors.Select(error => error.Description));

            // Return the error message as a response
            return BadRequest(errorMessage);
        }

        var (publicKeyBase64, privateKeyBase64) = hybridEncryptionService.GenerateKeys();

        var encryptedPrivateKey =
            await hybridEncryptionService.EncryptKeyAndSaveToAzureKeyVault(privateKeyBase64, user.Id);

        var userProfile = new UserProfile
        {
            AppUser = user,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            UserId = user.Id,
            PrivateKey = encryptedPrivateKey,
            PublicKey = publicKeyBase64
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
        privateKeyCache.RemovePrivateKey(UserProfileHelper.GetUserIdFromClaims(User));
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