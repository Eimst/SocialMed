using Core.Entities;
using Core.Interfaces;

namespace API.Helpers;

public static class NotificationHelper
{
    public static void AddNotification(IUnitOfWork unit, Notification notification)
    {
        unit.Repository<Notification>().Add(notification);
    }
    
}