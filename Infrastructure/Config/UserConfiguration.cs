using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class UserConfiguration : IEntityTypeConfiguration<UserProfile>
{
    public void Configure(EntityTypeBuilder<UserProfile> builder)
    {
        builder.HasMany(u => u.Comments)
            .WithOne(c => c.UserProfile)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasMany(u => u.Posts)
            .WithOne(c => c.UserProfile)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasMany(u => u.Likes)
            .WithOne(c => c.UserProfile)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasOne(up => up.AppUser) 
            .WithOne()
            .HasForeignKey<UserProfile>(up => up.UserId) 
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.ReceivedFriendRequests)
            .WithOne(x => x.Responder)
            .HasForeignKey(x => x.ResponderId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.HasMany(x => x.SentFriendRequests)
            .WithOne(x => x.Requester)
            .HasForeignKey(x => x.RequesterId)
            .OnDelete(DeleteBehavior.NoAction);

    }
}