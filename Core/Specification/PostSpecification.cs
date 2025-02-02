using Core.Entities;

namespace Core.Specification;

public class PostSpecification : BaseSpecification<Post>
{
    public PostSpecification() : base(null)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.UserProfile);
        AddInclude(x => x.Likes.Select(l => l.UserProfile));
        AddInclude(x => x.Comments.Select(l => l.UserProfile));
        AddOrderByDescending(x => x.DateCreated);
    }
    
    public PostSpecification(string id) : base(entity => entity.Id == id)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.Likes.Select(l => l.UserProfile));
        AddInclude(x => x.Comments.Select(l => l.UserProfile));
        AddInclude(x => x.UserProfile);
    }
    
    public PostSpecification(string userId, bool isUserId) : base(x => x.UserId == userId)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.UserProfile);
        AddInclude(x => x.Likes.Select(l => l.UserProfile));
        AddInclude(x => x.Comments.Select(l => l.UserProfile));
        AddOrderByDescending(x => x.DateCreated);
    }
}