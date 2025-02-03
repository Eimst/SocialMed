using System.Linq.Expressions;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Infrastructure.Data;

public static class SpecificationEvaluator<T> where T : BaseEntity
{
    public static IQueryable<T> GetQuery(IQueryable<T> query, ISpecification<T> specification)
    {
        if (specification.Criteria != null)
        {
            query = query.Where(specification.Criteria);
        }

        query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));
        
        if (specification is ISpecification<T, IUserProfile> specWithThenIncludes)
        {
            foreach (var thenInclude in specWithThenIncludes.ThenIncludes)
            {
                query = query.Include(thenInclude.Item1).ThenInclude(thenInclude.Item2);
            }
        }


        if (specification.OrderByDescending != null)
            query = query.OrderByDescending(specification.OrderByDescending);

        if (specification.OrderByAscending != null)
            query = query.OrderBy(specification.OrderByAscending);

        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        return query;
    }
}