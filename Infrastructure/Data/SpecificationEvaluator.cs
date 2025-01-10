using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public static class SpecificationEvaluator <T> where T : BaseEntity
{
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> specification)
    {
        if (specification.Criteria != null)
        {
            query = query.Where(specification.Criteria);
        }
        
        query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));

        if (specification.OrderByDescending != null) 
            query = query.OrderByDescending(specification.OrderByDescending);
        
        if (specification.OrderByAscending != null) 
            query = query.OrderBy(specification.OrderByAscending);
        
        return query;
    }
}