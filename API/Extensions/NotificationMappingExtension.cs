using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class NotificationMappingExtension
{
    public static NotificationDto ToDto(this Notification notification, UserProfile userProfile)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            Initiator = userProfile.ToDto(),
            Date = notification.Date,
            Text = notification.Text,
        };

    }
}