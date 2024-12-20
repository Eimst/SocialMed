using Core.Entities;

namespace Core.Specification;

public class FriendSpecification : BaseSpecification<Friend>
{
    public FriendSpecification(string userId) : base(entity =>
        (entity.RequesterId == userId || entity.ResponderId == userId) && entity.Status == Status.Friend)
    {
        AddInclude(x => x.Requester);
        AddInclude(x => x.Responder);
        AddOrderByDescending(x => x.DateCreated);
    }

    public FriendSpecification(string currentUserId, string userId) : base(entity =>
        entity.RequesterId == userId && entity.ResponderId == currentUserId ||
        entity.ResponderId == userId && entity.RequesterId == currentUserId)
    {
        AddInclude(x => x.Requester);
        AddInclude(x => x.Responder);
        AddOrderByDescending(x => x.DateCreated);
    }
}