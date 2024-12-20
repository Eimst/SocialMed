using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class FriendConfiguration : IEntityTypeConfiguration<Friend>
{
    public void Configure(EntityTypeBuilder<Friend> builder)
    {
        builder.HasKey(f => f.Id); // Composite key

        builder.HasOne(f => f.Requester)
            .WithMany(u => u.SentFriendRequests)
            .HasForeignKey(f => f.RequesterId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.Responder)
            .WithMany(u => u.ReceivedFriendRequests)
            .HasForeignKey(f => f.ResponderId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}