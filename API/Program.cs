using API.SignalR;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<MediaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<IHybridEncryptionService, HybridEncryptionService>();
builder.Services.AddScoped<IHybridDecryptionService, HybridDecryptionService>();

builder.Services.AddScoped<IPrivateKeyCache, PrivateKeyCache>();

builder.Services.AddCors();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; // Required for cross-origin cookies
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Requires HTTPS
    options.ExpireTimeSpan = TimeSpan.FromDays(2);
    options.SlidingExpiration = true;
});


builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<MediaContext>();

builder.Services.AddSignalR();
var app = builder.Build();

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

app.UseCors(x =>
{
    if (allowedOrigins != null)
        x.AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins(allowedOrigins);
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// app.MapGroup("api").MapIdentityApi<AppUser>();

app.MapHub<NotificationHub>("/hub/notifications");

try
{
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MediaContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    Console.WriteLine("Starting migrations...");
    await context.Database.MigrateAsync();
    Console.WriteLine("Migrations applied successfully.");
    if (app.Environment.IsDevelopment())
    {
        await SeedData.SeedAsync(context, userManager, builder.Configuration);
    }
}

catch (Exception e)
{
    Console.WriteLine(e);
    throw;
}

app.Run();