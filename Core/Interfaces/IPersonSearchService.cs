using Core.Entities;

namespace Core.Interfaces;

public interface IPersonSearchService
{
    List<UserProfile> SearchForPerson(string firstName, string lastName, string? currentUserId, List<UserProfile> userProfiles);
}