using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class FriendMappingExtension
{
    public static FriendDto ToFriendDto(this Friend friend,
        string userId)
    {
        if (friend.RequesterId != userId)
            return new FriendDto
            {
                DateCreated = friend.DateCreated,
                Status = friend.Status != Status.Friend ? Status.NeedToConfirm.ToString() : friend.Status.ToString(),
                UserProfileInfo = ToUserProfileInfoDto(friend.Requester)
            };

        return new FriendDto
        {
            DateCreated = friend.DateCreated,
            Status = friend.Status != Status.Friend ? Status.WaitingForConfirmation.ToString() : friend.Status.ToString(),
            UserProfileInfo = ToUserProfileInfoDto(friend.Responder)
        };
    }

    private static UserProfileInfoDto ToUserProfileInfoDto(this UserProfile user)
    {
        return new UserProfileInfoDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            ProfileId = user.Id,
            ProfilePictureUrl = user.ProfilePictureUrl,
        };
    }
    
    // public static NotificationDto ToNotificationDto(this Friend friend, Notification notification)
    // {
    //     return new NotificationDto
    //     {
    //         UserProfile = friend.Requester.ToDto(),
    //         Date = friend.DateCreated,
    //         Text = "Sent you a friend request"
    //     };
    // }
    
    public static Notification ToNotification(this Friend friend)
    {
        return new Notification
        {
            Date = friend.DateCreated,
            Text = "Sent you a friend request",
            OwnerId = friend.ResponderId,
            InitiatorId = friend.RequesterId,
            isDeleted = false,
            Initiator = friend.Requester
        };
    }
}