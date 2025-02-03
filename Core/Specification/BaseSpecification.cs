using System.Linq.Expressions;
using Core.Interfaces;

namespace Core.Specification;

public class BaseSpecification<T>(Expression<Func<T, bool>>? critiria) : ISpecification<T>
{
    public Expression<Func<T, bool>>? Criteria => critiria;

    public List<Expression<Func<T, object>>> Includes { get; } = [];

    public Expression<Func<T, object>>? OrderByDescending { get; set; }

    public Expression<Func<T, object>>? OrderByAscending { get; set; }

    public int Skip { get; private set; }

    public int Take { get; private set; }

    public bool IsPagingEnabled { get; private set; }
    
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

    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }
}

public class BaseSpecification<T, TPrevious>(Expression<Func<T, bool>>? criteria)
    : BaseSpecification<T>(criteria), ISpecification<T, TPrevious>
{

    public List<(Expression<Func<T, IEnumerable<TPrevious>>>, Expression<Func<TPrevious, object>>)> ThenIncludes { get; } = [];
    
    protected void AddThenInclude(
        Expression<Func<T, IEnumerable<TPrevious>>> includeExpression,
        Expression<Func<TPrevious, object>> thenIncludeExpression)
    {
        ThenIncludes.Add((includeExpression, thenIncludeExpression));
    }
    
}