using Core.Entities;

namespace Core.Specification;

public class UserProfileSpecification : BaseSpecification<UserProfile>
{
    public UserProfileSpecification(string id) : base(u => u.UserId == id)
    {
        AddInclude(x => x.Comments);
        AddInclude(x => x.Likes);
        AddInclude(x => x.Posts);
    }
}