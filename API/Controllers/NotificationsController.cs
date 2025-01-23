using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.SignalR;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController(IUnitOfWork unit, IHubContext<NotificationHub> hubContext) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<NotificationDto>>> GetAllNotifications()
    {
        var currentUser = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (currentUser == null)
            return Forbid();

        var notifications = await unit.Repository<Notification>().GetListWithSpecsAsync(new NotificationSpecification(currentUser.Id));
        
        return Ok(notifications.Select(x => x.ToDto(x.Initiator)).ToList());
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<List<NotificationDto>>> MarkNotificationAsDeleted(string id)
    {
        var currentUser = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (currentUser == null)
            return Forbid();

        var notification = await unit.Repository<Notification>().GetByIdAsync(id);

        if (notification == null)
            return NotFound();

        if (notification.OwnerId != currentUser.Id)
        {
            return Forbid();
        }
        
        notification.isDeleted = true;
        unit.Repository<Notification>().Update(notification);

        if (!await unit.Complete()) 
            return BadRequest("Error while saving notification");
        
        await hubContext.Clients.Group(currentUser.Id).SendAsync("NotificationDeleted", notification.Id);
        return NoContent();

    }
}