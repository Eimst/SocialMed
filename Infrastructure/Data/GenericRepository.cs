using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class GenericRepository<T>(MediaContext context) : IGenericRepository<T> where T : BaseEntity
{
    public async Task<T?> GetByIdWithSpecsAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).FirstOrDefaultAsync();
    }
    
    public async Task<T?> GetByIdAsync(string id)
    {
        return await context.Set<T>().FindAsync(id);
    }

    public async Task<List<T>> GetListWithSpecsAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).ToListAsync();
    }

    public async Task<List<T>> GetListAsync()
    {
        return await context.Set<T>().ToListAsync();
    }
    
    public void Add(T entity)
    {
        context.Set<T>().Add(entity);
    }

    public void Update(T entity)
    {
        context.Set<T>().Attach(entity);
        context.Entry(entity).State = EntityState.Modified;
    }

    public void Remove(T entity)
    {
        context.Set<T>().Remove(entity);
    }

    public async Task<bool> Exists(string id)
    {
        return await context.Set<T>().AnyAsync(e => e.Id == id);
    }
    
    public async Task<int> CountAsync(ISpecification<T> spec)
    {
        return await ApplySpecification(spec).CountAsync();
    }
    
    private IQueryable<T> ApplySpecification(ISpecification<T> spec)
    {
        return SpecificationEvaluator<T>.GetQuery(context.Set<T>().AsQueryable(), spec);
    }
}