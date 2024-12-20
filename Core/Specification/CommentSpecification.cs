using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specification;

public class CommentSpecification : BaseSpecification<Comment>
{
    public CommentSpecification(string postId) : base(entity => entity.PostId == postId)
    {
        AddInclude(x => x.UserProfile);
        AddOrderByDescending(x => x.DateCreated);
    }
    
    public CommentSpecification(string postId, string id) : base(entity => entity.PostId == postId && entity.Id == id)
    {
        AddInclude(x => x.UserProfile);
    }
}