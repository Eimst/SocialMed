using API.DTOs;
using API.Extensions;
using API.Helpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;


[ApiController]
[Route("api/friends")]
public class FriendsController(IUnitOfWork unit) : ControllerBase
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

        if (friend != null)
            return friend.ToFriendDto(currentUserProfile.Id);

        return BadRequest("The relation to this user doesn't exist");
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

        if (await unit.Complete())
        {
            return CreatedAtAction(nameof(GetFriendStatus), new { userId }, friend.ToFriendDto(currentUserProfile.Id));
        }
        
        return BadRequest("Error while saving request");
    }
    
    [Authorize]
    [HttpPut("request/{userId}")]
    public async Task<ActionResult<UserProfileInfoDto>> ConfirmFriendRequest(string userId)
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
        
        return NoContent();

    }
    
    
    [Authorize]
    [HttpDelete("request/{userId}")]
    public async Task<ActionResult<UserProfileInfoDto>> DeleteRequest(string userId)
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
        
        if (existingFriendRelation == null || existingFriendRelation.RequesterId != userId && existingFriendRelation.Status == Status.Friend)
            return BadRequest("Relationship doesn't exist");
        
        unit.Repository<Friend>().Remove(existingFriendRelation);

        if (await unit.Complete())
        {
            return NoContent();
        }
        
        return BadRequest("Error while saving request");
    }
    
    
    [Authorize]
    [HttpDelete("{userId}")]
    public async Task<ActionResult<UserProfileInfoDto>> DeleteFriendRelation(string userId)
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
        
        if (existingFriendRelation is not { Status: Status.Friend })
            return BadRequest("Relationship doesn't exist");
        
        unit.Repository<Friend>().Remove(existingFriendRelation);

        if (!await unit.Complete()) 
            return BadRequest("Error while saving request");
            
        return NoContent();

    }
    
}