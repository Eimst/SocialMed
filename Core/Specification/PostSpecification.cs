using Core.Entities;
using Core.Interfaces;

namespace Core.Specification;

public class PostSpecification : BaseSpecification<Post, IUserProfile>
{
    public PostSpecification() : base(null)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.UserProfile);
        AddThenInclude(p => p.Comments, c => c.UserProfile);
        AddThenInclude(p => p.Likes, c => c.UserProfile);
        AddOrderByDescending(x => x.DateCreated);
    }
    
    public PostSpecification(string id) : base(entity => entity.Id == id)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.UserProfile);
        AddThenInclude(p => p.Comments, c => c.UserProfile);
        AddThenInclude(p => p.Likes, c => c.UserProfile);
    }
    
    public PostSpecification(string userId, bool isUserId) : base(x => x.UserId == userId)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.UserProfile);
        AddThenInclude(p => p.Comments, c => c.UserProfile);
        AddThenInclude(p => p.Likes, c => c.UserProfile);
        AddOrderByDescending(x => x.DateCreated);
    }
}