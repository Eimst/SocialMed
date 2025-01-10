namespace Core.Interfaces;

public interface IPrivateKeyCache
{
    void StorePrivateKey(string userId, string privateKey);
    
    string? GetPrivateKey(string userId);
    
    void RemovePrivateKey(string userId);
}