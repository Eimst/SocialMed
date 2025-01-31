using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

public class MessageSpecification : BaseSpecification<Message>
{
    private MessageSpecification(Expression<Func<Message, bool>> criteria, bool applyPagination = false) : base(criteria)
    {
        AddInclude(x => x.Sender);
        AddInclude(x => x.Receiver);
        AddOrderByDescending(x => x.DateCreated);
        
        if (applyPagination)
            ApplyPaging(0, 10);
    }

    public static MessageSpecification ByMessageId(string messageId)
    {
        return new MessageSpecification(x => x.Id == messageId);
    }

    public static MessageSpecification ByUserId(string currentUser, string userId)
    {
        return new MessageSpecification(x =>
            x.SenderId == currentUser && x.ReceiverId == userId || x.SenderId == userId && x.ReceiverId == currentUser);
    }

    public static MessageSpecification ByUserIdWithCursor(string currentUser, string userId, DateTime cursorDate)
    {
        return new MessageSpecification(x =>
            (x.SenderId == currentUser && x.ReceiverId == userId || x.SenderId == userId && x.ReceiverId == currentUser) && x.DateCreated < cursorDate, true);
    }
    
    public static MessageSpecification ByUserIdAndUnread(string currentUser, string userId)
    {
        return new MessageSpecification(x =>
            x.SenderId == userId && x.ReceiverId == currentUser && x.IsRead == false);
    }
}