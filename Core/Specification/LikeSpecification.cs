using Core.Entities;

namespace Core.Specification;

public class LikeSpecification : BaseSpecification<Like>
{
    public LikeSpecification(string postId) : base(entity => entity.PostId == postId)
    {
        AddInclude(x => x.UserProfile);
    }
    
    public LikeSpecification(string postId, string id) : base(entity => entity.PostId == postId && entity.Id == id)
    {
        AddInclude(x => x.UserProfile);
    }
}