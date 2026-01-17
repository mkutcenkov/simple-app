namespace SimpleApp.Api.Models;

public class City
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Country { get; set; } = string.Empty;
    public string? Admin1 { get; set; } // Region/State
}
