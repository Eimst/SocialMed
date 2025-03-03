using API.Helpers;
using API.Middleware;
using API.SignalR;
using Azure.Storage.Blobs;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

if (!builder.Environment.IsDevelopment())
{
    builder.Logging.ClearProviders();
    builder.Logging.AddConsole();
    builder.Logging.AddAzureWebAppDiagnostics();
    builder.Services.AddApplicationInsightsTelemetry(options =>
    {
        options.ConnectionString = builder.Configuration["ApplicationInsights:ConnectionString"];
    });
}

builder.Services.AddControllers();

builder.Services.AddDbContext<MediaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton(_ =>
    new BlobServiceClient(builder.Configuration["AzureBlob:ConnectionString"]));

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

builder.Services.AddMemoryCache();
builder.Services.AddScoped<IHybridEncryptionService, HybridEncryptionService>();
builder.Services.AddScoped<IHybridDecryptionService, HybridDecryptionService>();

builder.Services.AddScoped<IPrivateKeyCache, PrivateKeyCache>();
builder.Services.AddScoped<IActiveChatsCache, ActiveChatsCache>();

builder.Services.AddCors();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None; 
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
    options.ExpireTimeSpan = TimeSpan.FromDays(2);
    options.SlidingExpiration = true;
});


builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<MediaContext>();

builder.Services.AddSignalR();

BlobHelper.Initialize(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ErrorFormatterMiddleware>();

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

var logger = app.Services.GetService<ILogger<Program>>();
logger?.LogInformation("This is a test log message from the application.");
try
{

    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<MediaContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    logger?.Log(LogLevel.Information, "Starting migrations...");
    await context.Database.MigrateAsync();
    logger?.Log(LogLevel.Information, "Migrations applied successfully.");
    if (app.Environment.IsDevelopment())
    {
        await SeedData.SeedAsync(context, userManager, builder.Configuration);
    }
}

catch (Exception e)
{
    logger?.Log(LogLevel.Error, e.Message);
    throw;
}

app.Run();