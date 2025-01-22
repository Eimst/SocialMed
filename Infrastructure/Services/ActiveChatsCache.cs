using Core.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace Infrastructure.Services;

public class ActiveChatsCache(IMemoryCache memoryCache) : IActiveChatsCache
{
    private static readonly object _lock = new();

    public HashSet<string> AddActiveUserChat(string userId, string userChatId)
    {
        lock (_lock)
        {
            var currentChats = GetActiveUserChats(userId) ?? [];
            currentChats.Add(userChatId);

            memoryCache.Set(userId, currentChats, TimeSpan.FromDays(2));
            return currentChats;
        }
    }

    private HashSet<string>? GetActiveUserChats(string userId)
    {
        memoryCache.TryGetValue(userId, out HashSet<string>? chats);
        return chats;
    }

    public HashSet<string> RemoveActiveUserChat(string userId, string userChatId)
    {
        lock (_lock)
        {
            var currentChats = GetActiveUserChats(userId) ?? [];
            currentChats.Remove(userChatId);

            if (currentChats.Any())
                memoryCache.Set(userId, currentChats, TimeSpan.FromDays(2));
            else
                memoryCache.Remove(userId);
            
            return currentChats;
        }
    }
}