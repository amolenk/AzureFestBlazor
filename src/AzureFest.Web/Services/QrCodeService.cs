using QRCoder;

namespace AzureFest.Web.Services;

public interface IQrCodeService
{
    string GenerateQrCodeBase64(string content);
}

public class QrCodeService : IQrCodeService
{
    public string GenerateQrCodeBase64(string content)
    {
        using var qrGenerator = new QRCodeGenerator();
        var qrCodeData = qrGenerator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);
        using var qrCode = new PngByteQRCode(qrCodeData);
        var qrCodeBytes = qrCode.GetGraphic(20);
        return Convert.ToBase64String(qrCodeBytes);
    }
}