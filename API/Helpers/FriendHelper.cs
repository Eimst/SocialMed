using System.Security.Claims;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;

namespace API.Helpers;

public static class FriendHelper
{
    public static async  Task<Friend?> GetExistingRelation(IUnitOfWork unit, ClaimsPrincipal User, string userId)
    {
        var userWhoSendReqProfile = await unit.Repository<UserProfile>().GetByIdAsync(userId);

        if (userWhoSendReqProfile == null)
            throw new KeyNotFoundException($"User not found");

        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (currentUserProfile == null || userWhoSendReqProfile.Id == currentUserProfile.Id)
            throw new InvalidOperationException("Forbidden operation");

        var friendSpecification = new FriendSpecification(currentUserProfile.Id, userWhoSendReqProfile.Id);

        return await unit.Repository<Friend>().GetByIdWithSpecsAsync(friendSpecification);
    }
}