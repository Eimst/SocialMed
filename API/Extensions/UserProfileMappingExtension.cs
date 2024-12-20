using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class UserProfileMappingExtension
{
    public static UserProfileDto ToDto(this UserProfile userProfile)
    {
        // if (userProfile is null)
        //     return null;
        return new UserProfileDto
        {
            FirstName = userProfile.FirstName,
            LastName = userProfile.LastName,
            ProfilePictureUrl = userProfile.ProfilePictureUrl
        };
    }
    
}