using System.Security.Cryptography;
using System.Text;

namespace AzureFest.Remind;

public class HmacService
{
    private readonly string _secretKey;

    public HmacService()
    {
        _secretKey = "AzureFest-Default-Secret-Key-Change-In-Production";
    }

    public string GenerateSignature(string registrationId)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_secretKey));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registrationId));
        // Ensure the signature is URL-safe
        return Convert.ToBase64String(hash).Replace("+", "-").Replace("/", "_").Replace("=", "");
    }
}