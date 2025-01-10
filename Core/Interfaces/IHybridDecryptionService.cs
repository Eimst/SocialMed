namespace Core.Interfaces;

public interface IHybridDecryptionService
{
    Task<string> DecryptEncryptedPrivateKey(string encryptedKeyWithIV, string userId);

    Task<string> DecryptMessage(string privateKeyBase64, string encryptedMessage);
}