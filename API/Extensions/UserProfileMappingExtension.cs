using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class UserProfileMappingExtension
{
    public static UserProfileInfoDto ToDto(this UserProfile userProfile)
    {
        return new UserProfileInfoDto
        {
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            ProfilePictureUrl = userProfile.ProfilePictureUrl,
            ProfileId = userProfile.Id
        };
    }
    
}