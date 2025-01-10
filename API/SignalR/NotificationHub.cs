using System.Collections.Concurrent;
using API.Helpers;
using Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class NotificationHub(IUnitOfWork unit) : Hub
{
    private static readonly ConcurrentDictionary<string, string> UserConnections = new();

    public override async Task OnConnectedAsync()
    {
        var user = await GetUser();

        UserConnections.TryAdd(user, Context.ConnectionId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = await GetUser();
        
        UserConnections.TryRemove(user, out _);
        
        await base.OnDisconnectedAsync(exception);
    }


    private async Task<string> GetUser()
    {
        var user = Context.ConnectionId;

        if (Context.User == null) 
            return user;

        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, Context.User);

        if (userProfile != null)
            user = userProfile.Id;

        return user;
    }
    
    public static bool IsUserConnected(string userId)
    {
        return UserConnections.ContainsKey(userId);
    }
    
    public static string? GetConnectionId(string userId)
    {
        UserConnections.TryGetValue(userId, out var connectionId);
        return connectionId;
    }

}