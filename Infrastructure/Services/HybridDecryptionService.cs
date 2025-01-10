using System.Security.Cryptography;
using System.Text;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Polly;

namespace Infrastructure.Services;

public class HybridDecryptionService(IConfiguration config) : IHybridDecryptionService
{
    private static async Task<string> DecryptWithAes(string ivBase64, string encryptedTextBase64, byte[] encryptionKey)
    {
        var iv = Convert.FromBase64String(ivBase64);
        var encryptedText = Convert.FromBase64String(encryptedTextBase64);
        
        using var aes = Aes.Create();
        aes.Key = encryptionKey; 
        aes.IV = iv;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7; 
        
        try
        {
            await using var ms = new MemoryStream(encryptedText);
            await using var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
            await using var outputStream = new MemoryStream();
            await cs.CopyToAsync(outputStream); 
            return Convert.ToBase64String(outputStream.ToArray()); 
        }
        catch (CryptographicException ex)
        {
            throw new InvalidOperationException($"Decryption with AES failed. Possible padding mismatch or corrupted data. {ex.Message}");
        }
    }

    private async Task<string?> GetEncryptionKeyFromAzureKeyVault(string userId)
    {
        var retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt))); // Exponential backoff

        return await retryPolicy.ExecuteAsync(async () =>
        {
            var secretClient = new SecretClient(
                new Uri(config["AzureKeyVault"] ?? throw new InvalidOperationException("Azure Key Vault URI is not configured")),
                new DefaultAzureCredential());

            var keyPrefix = config["AzureKeyVaultKeyStartedPhrase"] ?? "EncryptionKey";
            var secretName = $"{keyPrefix}-{userId}";
            var response = await secretClient.GetSecretAsync(secretName);
            return response.HasValue ? response.Value.Value : null;
        });
    }
    
    public async Task<string> DecryptEncryptedPrivateKey(string encryptedKeyWithIV, string userId)
    {
        var encryptionKeyBase64 = await GetEncryptionKeyFromAzureKeyVault(userId);

        if (encryptionKeyBase64 == null)
        {
            throw new InvalidOperationException($"Failed to get encryption key for user {userId}");
        }

        var parts = encryptedKeyWithIV.Split(':');
        var ivBase64 = parts[0];
        var encryptedPrivateKeyBase64 = parts[1];
        var encryptionKey = Convert.FromBase64String(encryptionKeyBase64);
        
        var privateKeyBase64 = await DecryptWithAes(ivBase64, encryptedPrivateKeyBase64, encryptionKey);
       
       return privateKeyBase64;
    }

    private byte[] DecryptWithRsa(string privateKeyBase64, string textToDecrypt)
    {
        try
        {
            using var rsa = RSA.Create();
            rsa.ImportRSAPrivateKey(Convert.FromBase64String(privateKeyBase64), out _);

            var encryptedEncryptionKeyBytes = Convert.FromBase64String(textToDecrypt);
            var decryptedKey = rsa.Decrypt(encryptedEncryptionKeyBytes, RSAEncryptionPadding.OaepSHA256);

            return decryptedKey;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Decryption with RSA failed. {ex.Message}");
        }
    }
    
    
    public async Task<string> DecryptMessage(string privateKeyBase64, string encryptedMessage)
    {
        var parts = encryptedMessage.Split(':');
        
        if (parts.Length != 3)
            throw new ArgumentException("Encrypted message must contain exactly three parts (IV, encrypted message, and encrypted key).");
        
        var ivBase64 = parts[0];
        var encMessage = parts[1];
        var encryptedEncryptionKey = parts[2];
        
        var decryptedKey = DecryptWithRsa(privateKeyBase64, encryptedEncryptionKey);
        var decryptedMessageBase64 = await DecryptWithAes(ivBase64, encMessage, decryptedKey);
        
        return Encoding.UTF8.GetString(Convert.FromBase64String(decryptedMessageBase64));
    }
}