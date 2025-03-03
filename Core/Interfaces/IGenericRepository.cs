using Core.Entities;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(string id);
    
    Task<List<T>> GetListAsync();

    Task<List<T>> GetListWithSpecsAsync(ISpecification<T> spec);

    Task<T?> GetByIdWithSpecsAsync(ISpecification<T> spec);

    void Add(T entity);

    void Update(T entity);

    void Remove(T entity);

    Task<int> CountAsync(ISpecification<T> spec);

    Task<bool> Exists(string id);
}