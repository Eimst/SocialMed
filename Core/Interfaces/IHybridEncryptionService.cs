namespace Core.Interfaces;

public interface IHybridEncryptionService
{
    (string publicKey, string privateKey) GenerateKeys();

    Task<string> EncryptKeyAndSaveToAzureKeyVault(string privateKey, string userId);
    
    Task<string> EncryptMessage(string message, string publicKey);
}