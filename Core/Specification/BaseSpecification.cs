using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specification;

public class BaseSpecification<T>(Expression<Func<T, bool>>? critiria) : ISpecification<T>
{
    public Expression<Func<T, bool>>? Criteria => critiria;
    
    public List<Expression<Func<T, object>>> Includes { get; } = [];
    
    public Expression<Func<T, object>>? OrderByDescending { get; set; }
    
    public Expression<Func<T, object>>? OrderByAscending { get; set; }

    protected void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected void AddOrderByDescending(Expression<Func<T, object>> orderByExpression)
    {
        OrderByDescending = orderByExpression;
    }
    
    protected void AddOrderByAscending(Expression<Func<T, object>> orderByExpression)
    {
        OrderByAscending = orderByExpression;
    }
}
