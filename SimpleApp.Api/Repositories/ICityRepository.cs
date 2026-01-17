using SimpleApp.Api.Models;

namespace SimpleApp.Api.Repositories;

public interface ICityRepository
{
    Task<IEnumerable<City>> GetAllAsync();
    Task<City?> GetByIdAsync(int id);
    Task AddAsync(City city);
    Task DeleteAsync(int id);
}
