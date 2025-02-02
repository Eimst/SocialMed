
namespace API.Middleware;

public class ErrorFormatterMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        await next(context);
    }
}