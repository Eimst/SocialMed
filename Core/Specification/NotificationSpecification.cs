using Core.Entities;

namespace Core.Specification;

public class NotificationSpecification : BaseSpecification<Notification>
{
    public NotificationSpecification(string currentUserId) : base(entity =>
        entity.OwnerId == currentUserId && !entity.isDeleted)
    {
        AddInclude(x => x.Initiator);
        AddOrderByDescending(x => x.Date);
    }
    
    public NotificationSpecification(string currentUserId, string initUser) : base(entity =>
    entity.OwnerId == initUser && entity.InitiatorId == currentUserId && !entity.isDeleted)
    {
        AddInclude(x => x.Initiator);
        AddOrderByDescending(x => x.Date);
    }
}