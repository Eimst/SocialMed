using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Services;

public class PersonSearchService : IPersonSearchService
{
    public List<UserProfile> SearchForPerson(string firstName, string lastName, List<UserProfile> userProfiles)
    {
        if (userProfiles.Count == 0)
            return [];

        const double similarityThreshold = 50;
        var similarities = new Dictionary<UserProfile, double>();

        foreach (var userProfile in userProfiles)
        {
            var firstNameSimilarity = CalculateJaccardSimilarity(firstName, userProfile.FirstName);

            var lastNameSimilarity = string.IsNullOrEmpty(lastName)
                ? firstNameSimilarity
                : CalculateJaccardSimilarity(lastName, userProfile.LastName.ToLowerInvariant());

            var combinedSimilarity = (firstNameSimilarity + lastNameSimilarity) / 2;
            if (combinedSimilarity > similarityThreshold)
                similarities.Add(userProfile, combinedSimilarity);
        }

        return similarities
            .OrderByDescending(x => x.Value)
            .Select(x => x.Key)
            .Take(4)
            .ToList();
    }


    private static double CalculateJaccardSimilarity(string source, string target)
    {
        if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(target))
            return 0;

        var sourceSet = new HashSet<char>(source.ToLowerInvariant());
        var targetSet = new HashSet<char>(target.ToLowerInvariant());

        var intersection = sourceSet.Intersect(targetSet).Count();
        var union = sourceSet.Union(targetSet).Count();

        return (double)intersection / union * 100;
    }
}