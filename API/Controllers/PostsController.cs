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
public class PostsController(IUnitOfWork unit, IHubContext<NotificationHub> hubContext) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<PostDto>>> GetAllPosts()
    {
        var specs = new PostSpecification();
        var post = await unit.Repository<Post>().GetListWithSpecsAsync(specs);

        return post.Select(x => x.ToDto()).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPostById(string id)
    {
        var specs = new PostSpecification(id);
        var post = await unit.Repository<Post>().GetByIdWithSpecsAsync(specs);

        if (post == null)
            return NotFound();

        return post.ToDto();
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostDto>> AddPost(PostCreateUpdateDto postCreateUpdateDto)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);

        if (userProfile == null)
        {
            return BadRequest("User not found");
        }

        var newPost = postCreateUpdateDto.ToEntity(userProfile);
        unit.Repository<Post>().Add(newPost);

        if (!await unit.Complete()) 
            return BadRequest("Error while adding post");
        
        await hubContext.Clients.All.SendAsync("NewPostCreated", newPost.ToDto());
        return CreatedAtAction(nameof(GetPostById), new { id = newPost.Id }, newPost.ToDto());

    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePost(string id, PostCreateUpdateDto postCreateUpdateDto)
    {
        if (!await IsPostIsCurrentUser(id))
            return Forbid();
            
        var post = await unit.Repository<Post>().GetByIdAsync(id);
        
        if (post == null)
            return NotFound();

        post.ImageUrl = postCreateUpdateDto.ImageUrl;
        post.Content = postCreateUpdateDto.Content;

        unit.Repository<Post>().Update(post);

        if (await unit.Complete())
            return NoContent();

        return NotFound();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePost(string id)
    {
        if (!await IsPostIsCurrentUser(id))
            return Forbid();
        
        var post = await unit.Repository<Post>().GetByIdAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        unit.Repository<Post>().Remove(post);

        if (!await unit.Complete()) 
            return BadRequest("Error while deleting post");
        
        await hubContext.Clients.All.SendAsync("PostDeleted", post.Id);
        return NoContent();

    }

    private async Task<bool> IsPostIsCurrentUser(string id)
    {
        var userProfile = await UserProfileHelper.GetAuthorizedUserProfile(unit, User);
        
        return userProfile != null && userProfile.Posts.Any(p => p.Id == id);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<PostDto>>> GetPostsByUserId(string userId)
    {
        var posts = await unit.Repository<Post>().GetListWithSpecsAsync(new PostSpecification(userId, true));
        
        return posts.Select(x => x.ToDto()).ToList();
    }
}