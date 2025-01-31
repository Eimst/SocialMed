using Core.Entities;

namespace API.Helpers;

public static class BlobHelper
{
    private static string? _defaultImageUrl;

    public static void Initialize(IConfiguration configuration)
    {
        _defaultImageUrl = configuration["DefaultProfileImage"];
        if (string.IsNullOrEmpty(_defaultImageUrl))
        {
            throw new InvalidOperationException("DefaultImageUrl is not configured in appsettings.");
        }
    }

    public static string GetProfilePictureUrl(UserProfile userProfile)
    {
        return userProfile.ProfilePictureUrl == _defaultImageUrl ? _defaultImageUrl! : userProfile.ProfilePictureUrl;
    }
}