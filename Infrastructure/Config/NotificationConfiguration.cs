using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasIndex(x => new { x.OwnerId, x.isDeleted });

        builder.HasOne(x => x.Initiator)
            .WithMany()
            .HasForeignKey(x => x.InitiatorId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}