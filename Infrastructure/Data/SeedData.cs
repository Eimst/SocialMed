using Core.Entities;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(MediaContext context, UserManager<AppUser> userManager, IConfiguration configuration)
    {
        
        // Check if the users already exist
        if (!userManager.Users.Any())
        {
            var user1 = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "e@test.lt",
                Email = "e@test.lt"
            };

            var user2 = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "v@test.lt",
                Email = "v@test.lt"
            };

            // Create users with default passwords
            await userManager.CreateAsync(user1, configuration["AccountPassword"]!);
            await userManager.CreateAsync(user2, configuration["AccountPassword"]!);

            var encryptionService = new HybridEncryptionService(configuration);
            var (publicKeyBase64, privateKeyBase64) = encryptionService.GenerateKeys();
            var encryptedKey = await encryptionService.EncryptKeyAndSaveToAzureKeyVault(privateKeyBase64, user1.Id);
            var profile1 = new UserProfile
            {
                Id = Guid.Parse("c65064e6-27a2-4066-b0b2-17bb2dd1a36c")
                    .ToString(),
                FirstName = "Eimantas",
                LastName = "Sutk",
                ProfilePictureUrl = configuration["DefaultProfileImage"]!,
                Bio = "Hello, I'm Eimantas",
                UserId = user1.Id,
                AppUser = user1,
                PrivateKey = encryptedKey,
                PublicKey = publicKeyBase64
            };

            var (publicKey1Base64, privateKey1Base64) = encryptionService.GenerateKeys();
            var encryptedKey1 = await encryptionService.EncryptKeyAndSaveToAzureKeyVault(privateKey1Base64, user2.Id);
            var profile2 = new UserProfile
            {
                Id = Guid.Parse("765064e6-27a2-4066-b0b2-17bb2dd1a36c")
                    .ToString(),
                FirstName = "Vilte",
                LastName = "Ask",
                ProfilePictureUrl = configuration["DefaultProfileImage"]!,
                Bio = "Hello, I'm Vilte",
                UserId = user2.Id,
                AppUser = user2,
                PrivateKey = encryptedKey1,
                PublicKey = publicKey1Base64
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

            // Create Friend relationships
            var friend1 = new Friend
            {
                Id = Guid.NewGuid()
                    .ToString(),
                RequesterId = profile1.Id,
                ResponderId = profile2.Id,
                DateCreated = DateTime.UtcNow,
                Status = Status.Friend,
                Requester = profile1,
                Responder = profile2
            };

            context.Friends.Add(friend1);
            
            await context.SaveChangesAsync();
        }
    }
}