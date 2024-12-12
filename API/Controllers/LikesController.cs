using System.Security.Claims;
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
[Route("api/posts/{postId}/[controller]")]
public class LikesController(IUnitOfWork unit) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<LikeDto>>> GetLikes(string postId)
    {
        ISpecification<Like> specs = new LikeSpecification(postId);
        var likes = await unit.Repository<Like>().GetListWithSpecsAsync(specs);

        return likes.Select(x => x.ToDto()).ToList();
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<LikeDto>> GetLikeById(string postId, string id)
    {
        ISpecification<Like> likeSpecification = new LikeSpecification(postId, id);
        
        var like = await unit.Repository<Like>().GetByIdWithSpecsAsync(likeSpecification);
        
        if (like == null)
            return NotFound();
        
        return like.ToDto();
    }
    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<List<LikeDto>>> CreateLike(string postId, LikeCreateDto likeCreateDto)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return Forbid();
        
        if (userProfile.Id != likeCreateDto.UserId)
        {
            return Forbid();
        }
        
        if (userProfile.Likes.Any(x => x.PostId == postId))
            return BadRequest("You cant't like this post again");
        
        var post = await unit.Repository<Post>().GetByIdAsync(postId);
        
        if (post == null)
            return BadRequest("Post not found");

        var like = likeCreateDto.ToEntity(userProfile, post);
        unit.Repository<Like>().Add(like);

        if (await unit.Complete())
            return CreatedAtAction(nameof(GetLikeById), new { postId, id = like.Id  }, like.ToDto());
        
        return BadRequest("Failed to add like");
    }
    
    [Authorize]
    [HttpDelete("{likeId}")]
    public async Task<ActionResult> DeleteLike(string postId, string likeId)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return Forbid();
        
        if (userProfile.Likes.All(x => x.Id != likeId))
        {
            return Forbid();
        }
        
        ISpecification<Like> specs = new LikeSpecification(postId, likeId);
        
        var like = await unit.Repository<Like>().GetByIdWithSpecsAsync(specs);

        if (like == null)
            return NotFound();
        
        unit.Repository<Like>().Remove(like);
        
        if (await unit.Complete())
            return NoContent();
        
        return BadRequest("Error deleting like");
    }
}