using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class MediaContext(DbContextOptions<MediaContext> options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Post> Posts { get; set; }
    
    public DbSet<Comment> Comments { get; set; }
    
    public DbSet<Like> Likes { get; set; }

    public DbSet<UserProfile> UserProfiles { get; set; }

    public DbSet<Friend> Friends { get; set; }
    
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MediaContext).Assembly);
        
    }

}