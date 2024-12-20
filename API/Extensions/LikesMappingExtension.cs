using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class LikesMappingExtension
{
    public static LikeDto ToDto(this Like like)
    {
        return new LikeDto
        {
            Id = like.Id,
            UserId = like.UserId,
            DateCreated = like.DateCreated,
            PostId = like.PostId,
            UserProfile = like.UserProfile.ToDto()
        };
    }
    
    public static Like ToEntity(this LikeCreateDto likeCreateDto, UserProfile user, Post post)
    {
        return new Like
        {
            UserId = likeCreateDto.UserId,
            PostId = post.Id,
            UserProfile = user,
            Post = post
        };
    }
}