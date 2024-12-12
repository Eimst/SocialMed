using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(MediaContext context, UserManager<AppUser> userManager)
    {
        // Check if the users already exist
        if (!userManager.Users.Any())
        {
            var user1 = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "john.doe",
                Email = "john.doe@example.com"
            };

            var user2 = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "jane.smith",
                Email = "jane.smith@example.com"
            };

            // Create users with default passwords
            await userManager.CreateAsync(user1, "Pa$$w0rd");
            await userManager.CreateAsync(user2, "Pa$$w0rd");
            
             var profile1 = new UserProfile
        {
            Id = Guid.Parse("c65064e6-27a2-4066-b0b2-17bb2dd1a36c").ToString(),
            FirstName = "Eimantas",
            LastName = "Sutk",
            ProfilePictureUrl = "https://example.com/profiles/john.jpg",
            Bio = "Hello, I'm John!",
            UserId = user1.Id,
            AppUser = user1
        };

        var profile2 = new UserProfile
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = "Tomas",
            LastName = "Ask",
            ProfilePictureUrl = "https://example.com/profiles/jane.jpg",
            Bio = "Jane's profile",
            UserId = user2.Id,
            AppUser = user2
        };

        context.UserProfiles.AddRange(profile1, profile2);

        // Create Posts
        var post1 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Content = "This is my first post!",
            ImageUrl = "https://example.com/posts/image1.jpg",
            DateCreated = DateTime.UtcNow,
            UserId = profile1.Id,
            UserProfile = profile1
        };

        var post2 = new Post
        {
            Id = Guid.NewGuid().ToString(),
            Content = "Loving this new platform.",
            ImageUrl = null,
            DateCreated = DateTime.UtcNow,
            UserId = profile2.Id,
            UserProfile = profile2
        };

        context.Posts.AddRange(post1, post2);

        // Create Comments
        var comment1 = new Comment
        {
            Id = Guid.NewGuid().ToString(),
            Text = "Great post!",
            DateCreated = DateTime.UtcNow,
            UserId = profile2.Id,
            UserProfile = profile2,
            PostId = post1.Id,
            Post = post1
        };

        var comment2 = new Comment
        {
            Id = Guid.NewGuid().ToString(),
            Text = "Thanks for sharing!",
            DateCreated = DateTime.UtcNow,
            UserId = profile1.Id,
            UserProfile = profile1,
            PostId = post2.Id,
            Post = post2
        };

        context.Comments.AddRange(comment1, comment2);

        // Create Likes
        var like1 = new Like
        {
            Id = Guid.NewGuid().ToString(),
            DateCreated = DateTime.UtcNow,
            UserId = profile1.Id,
            UserProfile = profile1,
            PostId = post2.Id,
            Post = post2
        };

        var like2 = new Like
        {
            Id = Guid.NewGuid().ToString(),
            DateCreated = DateTime.UtcNow,
            UserId = profile2.Id,
            UserProfile = profile2,
            PostId = post1.Id,
            Post = post1
        };

        context.Likes.AddRange(like1, like2);
        
        await context.SaveChangesAsync();
        }
        
    }
}

