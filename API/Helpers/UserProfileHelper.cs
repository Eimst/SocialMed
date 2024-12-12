using System.Security.Claims;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;

namespace API.Helpers;

public static class UserProfileHelper
{
    public static async Task<UserProfile?> GetAuthorizedUserProfile(IUnitOfWork unit, ClaimsPrincipal user)
    {
        var currentUserId = user.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        
        // Defensive check
        if (currentUserId == null)
            return null;
        
        var userProfile = await unit.Repository<UserProfile>().GetByIdWithSpecsAsync(new UserProfileSpecification(currentUserId));
        
        return userProfile;
    }
}