using API.Helpers;
using Core.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class NotificationHub(IUnitOfWork unit) : Hub
{
    
    public override async Task OnConnectedAsync()
    {
        var user = await GetUser();
        
        if (user != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, user);
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = await GetUser();
        if (user != null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, user);
        await base.OnDisconnectedAsync(exception);
    }

    private async Task<string?> GetUser()
    {
        if (Context.User == null) 
            return null;

        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, Context.User);

        return userProfile?.Id;
    }
    
    public async Task IdentifyConnection()
    {
        var user = await GetUser();
        
        if (user != null)
            await Groups.AddToGroupAsync(Context.ConnectionId, user);
    }
    
}