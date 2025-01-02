using Core.Entities;

namespace Core.Interfaces;

public interface IPersonSearchService
{
    List<UserProfile> SearchForPerson(string firstName, string lastName, List<UserProfile> userProfiles);
}