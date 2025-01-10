using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }
    
    List<Expression<Func<T, object>>> Includes { get; }
    
    public Expression<Func<T, object>>? OrderByDescending { get; set; }
    
    public Expression<Func<T, object>>? OrderByAscending { get; set; }
    
}