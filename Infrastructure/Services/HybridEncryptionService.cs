using System.Security.Cryptography;
using System.Text;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Polly;

namespace Infrastructure.Services;

public class HybridEncryptionService(IConfiguration config) : IHybridEncryptionService
{
    public async Task<string> EncryptKeyAndSaveToAzureKeyVault(string privateKeyBase64, string userId)
    {
        var encryptionKey = GenerateKey();

        await SaveToAzureKeyVault(userId, Convert.ToBase64String(encryptionKey));

        var (encryptedPrivateKeyBase64, ivBase64) =
            await EncryptWithAes(Convert.FromBase64String(privateKeyBase64), encryptionKey);

        return $"{ivBase64}:{encryptedPrivateKeyBase64}";
    }

    private static async Task<(string, string)> EncryptWithAes(byte[] plaintextBytes, byte[] encryptionKey)
    {
        using var aes = Aes.Create();
        aes.Key = encryptionKey;
        aes.GenerateIV();
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        try
        {
            await using var ms = new MemoryStream();
            await using var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write);

            cs.Write(plaintextBytes, 0, plaintextBytes.Length);
            await cs.FlushFinalBlockAsync();

            return (Convert.ToBase64String(ms.ToArray()), Convert.ToBase64String(aes.IV));
        }
        catch (CryptographicException ex)
        {
            throw new InvalidOperationException($"Encryption with AES failed. {ex.Message}");
        }
    }

    private static byte[] GenerateKey()
    {
        using var rng = RandomNumberGenerator.Create();
        var key = new byte[32];
        rng.GetBytes(key);

        if (key.Length != 32)
            throw new InvalidOperationException("Generated key has an invalid size.");

        return key;
    }

    private async Task SaveToAzureKeyVault(string userId, string encryptionKeyBase64)
    {
        var retryPolicy = Policy
            .Handle<Exception>()
            .WaitAndRetryAsync(3, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

        await retryPolicy.ExecuteAsync(async () =>
        {
            var secretClient =
                new SecretClient(
                    new Uri(config["AzureKeyVault"] ??
                            throw new InvalidOperationException("Azure Key Vault URI is not configured")),
                    new DefaultAzureCredential());

            var keyPrefix = config["AzureKeyVaultKeyStartedPhrase"] ?? "EncryptionKey";
            var secretName = $"{keyPrefix}-{userId}";
            await secretClient.SetSecretAsync(secretName, encryptionKeyBase64);
        });
    }

    public (string publicKey, string privateKey) GenerateKeys()
    {
        using var rsaKey = RSA.Create(2048);

        var privateKey = rsaKey.ExportRSAPrivateKey();
        var privateKeyBase64 = Convert.ToBase64String(privateKey);

        var publicKey = rsaKey.ExportRSAPublicKey();
        var publicKeyBase64 = Convert.ToBase64String(publicKey);

        return (publicKeyBase64, privateKeyBase64);
    }


    private string EncryptWithRsa(byte[] textToEncrypt, string publicKey)
    {
        try
        {
            using var rsa = RSA.Create();
            rsa.ImportRSAPublicKey(Convert.FromBase64String(publicKey), out _);

            var encryptedAesKey = rsa.Encrypt(textToEncrypt, RSAEncryptionPadding.OaepSHA256);
            var encryptedAesKeyBase64 = Convert.ToBase64String(encryptedAesKey);

            return encryptedAesKeyBase64;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Encryption with RSA failed. {ex.Message}");
        }
    }

    public async Task<string> EncryptMessage(string message, string publicKey)
    {
        if (string.IsNullOrWhiteSpace(message))
            throw new ArgumentException("Message cannot be null or empty.", nameof(message));
        if (string.IsNullOrWhiteSpace(publicKey))
            throw new ArgumentException("Public key cannot be null or empty.", nameof(publicKey));

        var aesKey = GenerateKey();

        var encryptedAesKeyBase64 = EncryptWithRsa(aesKey, publicKey);

        var (encryptedMessageBase64, ivBase64) = await EncryptWithAes(Encoding.UTF8.GetBytes(message), aesKey);

        return $"{ivBase64}:{encryptedMessageBase64}:{encryptedAesKeyBase64}";
    }
}