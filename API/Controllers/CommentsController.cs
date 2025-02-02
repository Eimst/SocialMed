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
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/posts/{postId}/[controller]")]
public class CommentsController(IUnitOfWork unit, IHubContext<NotificationHub> hubContext) : ControllerBase
{
    
    [HttpGet]
    public async Task<ActionResult<List<CommentDto>>> GetComments(string postId)
    {
        ISpecification<Comment> commentSpecification = new CommentSpecification(postId);
        
        var comments = await unit.Repository<Comment>().GetListWithSpecsAsync(commentSpecification);
        
        return comments.Select(comment => comment.ToDto(postId)).ToList();
    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<CommentDto>> GetCommentById(string postId, string id)
    {
        ISpecification<Comment> commentSpecification = new CommentSpecification(postId, id);
        
        var comment = await unit.Repository<Comment>().GetByIdWithSpecsAsync(commentSpecification);
        
        if (comment == null)
            return NotFound();
        
        return comment.ToDto(postId);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CommentDto>> AddComment( string postId, CommentCreateDto commentCreateDto)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return Forbid();
        
        if (userProfile.Id != commentCreateDto.UserId)
        {
            return Forbid();
        }
        
        var post = await unit.Repository<Post>().GetByIdAsync(postId);

        if (post == null)
        {
            return BadRequest("Post not found");
        }

        var newComment = commentCreateDto.ToEntity(userProfile, post);
        
        unit.Repository<Comment>().Add(newComment);

        if (!await unit.Complete()) 
            return BadRequest("Error while adding post");
        
        await hubContext.Clients.All.SendAsync("NewCommentCreated", newComment.ToDto(postId));
        return CreatedAtAction(nameof(GetCommentById), new { postId, id = newComment.Id  }, newComment.ToDto(postId));

    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteComment(string postId, string id)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        if (userProfile == null)
            return Forbid();
        
        ISpecification<Comment> specs = new CommentSpecification(postId, id);
        var comment = await unit.Repository<Comment>().GetByIdWithSpecsAsync(specs);
        
        if (comment == null)
            return NotFound();
        
        if (userProfile.Comments.All(x => x.Id != id))
        {
            return Forbid();
        }

        try
        {
            unit.Repository<Comment>().Remove(comment);

            if (!await unit.Complete())
                return BadRequest("Error while deleting post");
        }
        catch (DbUpdateConcurrencyException)
        {
            return NotFound("Comment is already deleted");
        }
        catch (Exception)
        {
            return StatusCode(500, "Something went wrong");
        }
        
        await hubContext.Clients.All.SendAsync("CommentDeleted", comment.Id, comment.PostId);
        return NoContent();
    }
}