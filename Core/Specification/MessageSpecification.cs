using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

public class MessageSpecification : BaseSpecification<Message>
{
    private MessageSpecification(Expression<Func<Message, bool>> criteria, bool isDesc = false) : base(criteria)
    {
        AddInclude(x => x.Sender);
        AddInclude(x => x.Receiver);
        if (isDesc)
            AddOrderByDescending(x => x.DateCreated);
        else
            AddOrderByAscending(x => x.DateCreated);
    }

    public static MessageSpecification ByMessageId(string messageId)
    {
        return new MessageSpecification(x => x.Id == messageId);
    }

    public static MessageSpecification ByUserId(string currentUser, string userId, bool isDesc = false)
    {
        return new MessageSpecification(x =>
            x.SenderId == currentUser && x.ReceiverId == userId || x.SenderId == userId && x.ReceiverId == currentUser, isDesc);
    }
    
    public static MessageSpecification ByUserIdAndUnread(string currentUser, string userId)
    {
        return new MessageSpecification(x =>
            x.SenderId == userId && x.ReceiverId == currentUser && x.IsRead == false);
    }
}