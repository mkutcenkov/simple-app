var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // In development, you might want to point to the React dev server.
    // For simplicity now, we'll just serve the built files.
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapFallbackToFile("/index.html");

app.Run();
