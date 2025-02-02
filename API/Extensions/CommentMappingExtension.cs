using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class CommentMappingExtension
{
    public static CommentDto ToDto(this Comment comment)
    {
        return new CommentDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            DateCreated = comment.DateCreated,
            Text = comment.Text,
            PostId = comment.PostId,
            UserProfile = comment.UserProfile.ToDto()
        };
    }
    
    public static Comment ToEntity(this CommentCreateDto comment, UserProfile userProfile, Post post)
    {
        return new Comment
        {
            UserId = comment.UserId,
            Text = comment.Text,
            PostId = post.Id,
            UserProfile = userProfile,
            Post = post
        };
    }
}