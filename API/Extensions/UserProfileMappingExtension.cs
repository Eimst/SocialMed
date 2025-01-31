using API.DTOs;
using API.Helpers;
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
            ProfilePictureUrl = BlobHelper.GetProfilePictureUrl(userProfile),
            ProfileId = userProfile.Id
        };
    }
    
}