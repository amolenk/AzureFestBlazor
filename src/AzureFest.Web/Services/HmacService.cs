using System.Security.Cryptography;
using System.Text;

namespace AzureFest.Web.Services;

public interface IHmacService
{
    string GenerateSignature(string registrationId);
    bool ValidateSignature(string registrationId, string signature);
}

public class HmacService : IHmacService
{
    private readonly string _secretKey;
    private readonly ILogger<HmacService> _logger;

    public HmacService(IConfiguration configuration, ILogger<HmacService> logger)
    {
        _secretKey = configuration["HmacSecretKey"] ?? "AzureFest-Default-Secret-Key-Change-In-Production";
        _logger = logger;
    }

    public string GenerateSignature(string registrationId)
    {
        try
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registrationId));
            return Convert.ToBase64String(hash).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating HMAC signature for registration {RegistrationId}", registrationId);
            throw;
        }
    }

    public bool ValidateSignature(string registrationId, string signature)
    {
        try
        {
            var expectedSignature = GenerateSignature(registrationId);
            return string.Equals(expectedSignature, signature, StringComparison.Ordinal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating HMAC signature for registration {RegistrationId}", registrationId);
            return false;
        }
    }
}