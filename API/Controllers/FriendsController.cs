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
public class FriendsController(IUnitOfWork unit, IHubContext<NotificationHub> hubContext) : ControllerBase
{
    [HttpGet("{userId}")]
    public async Task<ActionResult<List<FriendDto>>> GetFriendsByUserId(string userId)
    {
        var friendSpecification = new FriendSpecification(userId);
        var friends = await unit.Repository<Friend>().GetListWithSpecsAsync(friendSpecification);

        return friends.Select(x => x.ToFriendDto(userId)).ToList();
    }

    [Authorize]
    [HttpGet("{userId}/status")]
    public async Task<ActionResult<FriendDto>> GetFriendStatus(string userId)
    {
        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (currentUserProfile == null)
            return BadRequest("Error on getting profile information");

        var friendSpecification = new FriendSpecification(currentUserProfile.Id, userId);
        var friend = await unit.Repository<Friend>().GetByIdWithSpecsAsync(friendSpecification);

        return friend != null ? Ok(friend.ToFriendDto(currentUserProfile.Id)) : Ok("");
    }


    [Authorize]
    [HttpPost("request/{userId}")]
    public async Task<ActionResult<FriendDto>> MakeFriendRequest(string userId)
    {
        var userToMakeReqProfile = await unit.Repository<UserProfile>().GetByIdAsync(userId);

        if (userToMakeReqProfile == null)
            return BadRequest("User not found");

        var currentUserProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (currentUserProfile == null || userToMakeReqProfile.Id == currentUserProfile.Id)
            return BadRequest("Invalid request");

        var friendSpecification = new FriendSpecification(currentUserProfile.Id, userToMakeReqProfile.Id);

        var existingRelation = await unit.Repository<Friend>().GetByIdWithSpecsAsync(friendSpecification);

        if (existingRelation != null)
            return BadRequest("Request is already exist");

        var friend = new Friend
        {
            RequesterId = currentUserProfile.UserId,
            Requester = currentUserProfile,
            ResponderId = userToMakeReqProfile.Id,
            Responder = userToMakeReqProfile,
            Status = Status.WaitingForConfirmation
        };

        unit.Repository<Friend>().Add(friend);

        var notification = friend.ToNotification();
        NotificationHelper.AddNotification(unit, notification);

        if (!await unit.Complete())
            return BadRequest("Error while saving request");

        await hubContext.Clients.Group(userToMakeReqProfile.Id)
            .SendAsync("FriendRequestReceived", notification.ToDto(currentUserProfile));
        
        await hubContext.Clients.Group(currentUserProfile.Id)
            .SendAsync("FriendRequestReceived", userToMakeReqProfile.Id);

        return CreatedAtAction(nameof(GetFriendStatus), new { userId }, friend.ToFriendDto(currentUserProfile.Id));
    }

    [Authorize]
    [HttpPut("request/{userId}")]
    public async Task<ActionResult> ConfirmFriendRequest(string userId)
    {
        Friend? existingFriendRelation;
        try
        {
            existingFriendRelation = await FriendHelper.GetExistingRelation(unit, User, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        if (existingFriendRelation == null || existingFriendRelation.RequesterId != userId)
            return BadRequest("Relationship doesn't exist");

        existingFriendRelation.Status = Status.Friend;
        existingFriendRelation.DateCreated = DateTime.UtcNow;

        unit.Repository<Friend>().Update(existingFriendRelation);

        if (!await unit.Complete())
            return BadRequest("Error while saving request");

        await hubContext.Clients.Group(userId).SendAsync("FriendRequestAccepted",
            existingFriendRelation.ToFriendDto(existingFriendRelation.RequesterId));
        
        await hubContext.Clients.Group(existingFriendRelation.ResponderId).SendAsync("FriendRequestAccepted",
            existingFriendRelation.ToFriendDto(existingFriendRelation.ResponderId));

        return NoContent();
    }


    [Authorize]
    [HttpDelete("request/{userId}")]
    public async Task<ActionResult> DeleteRequest(string userId)
    {
        
        Friend? existingFriendRelation;
        try
        {
            existingFriendRelation = await FriendHelper.GetExistingRelation(unit, User, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        if (existingFriendRelation == null || existingFriendRelation.RequesterId != userId &&
            existingFriendRelation.Status == Status.Friend)
            return BadRequest("Relationship doesn't exist");

        unit.Repository<Friend>().Remove(existingFriendRelation);
        var notification = await unit.Repository<Notification>().GetByIdWithSpecsAsync(
            new NotificationSpecification(existingFriendRelation.RequesterId, existingFriendRelation.ResponderId));

        if (notification != null)
        {
            notification.isDeleted = true;
            unit.Repository<Notification>().Update(notification);
        }

        if (!await unit.Complete()) 
            return BadRequest("Error while saving request");
        
        await hubContext.Clients.Group(existingFriendRelation.ResponderId).SendAsync("FriendRequestDeleted", existingFriendRelation.RequesterId);
        await hubContext.Clients.Group(existingFriendRelation.RequesterId).SendAsync("FriendRequestDeleted", existingFriendRelation.ResponderId);

        return NoContent();
    }


    [Authorize]
    [HttpDelete("{userId}")]
    public async Task<ActionResult> DeleteFriendRelation(string userId)
    {
        var currentUser = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        if (currentUser == null)
            return Forbid();
        
        Friend? existingFriendRelation;
        try
        {
            existingFriendRelation = await FriendHelper.GetExistingRelation(unit, User, userId);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }

        if (existingFriendRelation is not { Status: Status.Friend })
            return BadRequest("Relationship doesn't exist");

        unit.Repository<Friend>().Remove(existingFriendRelation);

        if (!await unit.Complete())
            return BadRequest("Error while saving request");
        
        await hubContext.Clients.Group(userId).SendAsync("FriendDeleted", currentUser.Id);
        await hubContext.Clients.Group(currentUser.Id).SendAsync("FriendDeleted", userId);

        return NoContent();
    }
}