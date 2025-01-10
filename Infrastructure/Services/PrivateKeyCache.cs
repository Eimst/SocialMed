using Core.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services;

public class PrivateKeyCache(IMemoryCache memoryCache) : IPrivateKeyCache
{
    public void StorePrivateKey(string userId, string privateKey)
    {
        memoryCache.Set(userId, privateKey,  TimeSpan.FromDays(2));
    }

    public string? GetPrivateKey(string userId)
    {
        memoryCache.TryGetValue(userId, out string? privateKey);
        return privateKey;
    }

    public void RemovePrivateKey(string userId)
    {
        memoryCache.Remove(userId);
    }
}