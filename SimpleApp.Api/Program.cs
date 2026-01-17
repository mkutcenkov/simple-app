var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpClient();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // In development, you might want to point to the React dev server.
    // For simplicity now, we'll just serve the built files.
}

app.UseHttpsRedirection();

app.MapGet("/api/cities", async (string query, string? language, HttpClient client) =>
{
    if (string.IsNullOrWhiteSpace(query)) return Results.BadRequest("Query is required.");

    string searchDisplayName = query;
    try
    {
        // Detect language and translate to English for better search results
        var translateUrl = $"https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q={Uri.EscapeDataString(query)}";
        var translateResponse = await client.GetAsync(translateUrl);
        if (translateResponse.IsSuccessStatusCode)
        {
            var json = await translateResponse.Content.ReadAsStringAsync();
            using var doc = System.Text.Json.JsonDocument.Parse(json);
            var firstElement = doc.RootElement[0];
            if (firstElement.ValueKind == System.Text.Json.JsonValueKind.Array && firstElement.GetArrayLength() > 0)
            {
                var translationRow = firstElement[0];
                if (translationRow.ValueKind == System.Text.Json.JsonValueKind.Array && translationRow.GetArrayLength() > 0)
                {
                    searchDisplayName = translationRow[0].GetString() ?? query;
                }
            }
        }
    }
    catch
    {
        // Fallback to original query if translation fails
    }
    
    var languageParam = !string.IsNullOrWhiteSpace(language) ? $"&language={language}" : "";
    var response = await client.GetAsync($"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(searchDisplayName)}&count=10&format=json{languageParam}");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.MapGet("/api/weather", async (double lat, double lon, HttpClient client) =>
{
    var response = await client.GetAsync($"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.MapGet("/api/forecast", async (double lat, double lon, HttpClient client) =>
{
    var response = await client.GetAsync($"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapFallbackToFile("/index.html");

app.Run();
