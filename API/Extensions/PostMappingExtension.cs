using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class PostMappingExtension
{
    public static PostDto ToDto(this Post post)
    {
        return new PostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            DateCreated = post.DateCreated,
            Comments = post.Comments.Select(x => x.ToDto(post.Id)).ToList(),
            Likes = post.Likes.Select(x => x.ToDto()).ToList(),
            UserProfile = post.UserProfile.ToDto()
        };
    }

    public static Post ToEntity(this PostCreateUpdateDto postCreateUpdateDto, UserProfile userProfile)
    {
        return new Post
        {
            UserId = userProfile.Id,
            Content = postCreateUpdateDto.Content,
            ImageUrl = postCreateUpdateDto.ImageUrl,
            UserProfile = userProfile,
        };

    }
}