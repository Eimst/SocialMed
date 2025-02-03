using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }
    
    List<Expression<Func<T, object>>> Includes { get; }
    
    public Expression<Func<T, object>>? OrderByDescending { get; set; }
    
    public Expression<Func<T, object>>? OrderByAscending { get; set; }
    
    bool IsPagingEnabled { get;  }
    
    int Skip { get;  }

    int Take { get; }
    
}

public interface ISpecification<T, TPrevious> : ISpecification<T>
{
    public List<(Expression<Func<T, IEnumerable<TPrevious>>>, Expression<Func<TPrevious, object>>)> ThenIncludes { get; }
}
