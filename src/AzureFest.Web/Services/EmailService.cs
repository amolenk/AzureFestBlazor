using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AzureFest.Web.Services;

public interface IEmailService
{
    Task SendConfirmationEmailAsync(string toEmail, string firstName, string confirmationLink);
    Task SendTicketEmailAsync(string toEmail, string firstName, string qrCodeBase64);
}

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;

    public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendConfirmationEmailAsync(string toEmail, string firstName, string confirmationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@azurefest.nl"));
        message.To.Add(new MailboxAddress(firstName, toEmail));
        message.Subject = "Confirm your Azure Fest registration";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <h2>Welcome to Azure Fest!</h2>
                <p>Hi {firstName},</p>
                <p>Thank you for registering for Azure Fest. Please confirm your registration by clicking the link below:</p>
                <p><a href=""{confirmationLink}"" style=""background-color: #E459BB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"">Confirm Registration</a></p>
                <p>If you can't click the link, copy and paste this URL into your browser:</p>
                <p>{confirmationLink}</p>
                <p>We look forward to seeing you at Azure Fest!</p>
                <p>Best regards,<br>The Azure Fest Team</p>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(message);
    }

    public async Task SendTicketEmailAsync(string toEmail, string firstName, string qrCodeBase64)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@azurefest.nl"));
        message.To.Add(new MailboxAddress(firstName, toEmail));
        message.Subject = "Your Azure Fest ticket";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <h2>Your Azure Fest Ticket</h2>
                <p>Hi {firstName},</p>
                <p>Your registration has been confirmed! Here's your ticket for Azure Fest:</p>
                <div style=""text-align: center; margin: 20px 0;"">
                    <img src=""data:image/png;base64,{qrCodeBase64}"" alt=""Your QR Code Ticket"" style=""border: 1px solid #ccc; padding: 10px;"" />
                </div>
                <p>Please bring this QR code with you to the event. You can either print this email or show it on your mobile device.</p>
                <p>We look forward to seeing you at Azure Fest!</p>
                <p>Best regards,<br>The Azure Fest Team</p>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(message);
    }

    private async Task SendEmailAsync(MimeMessage message)
    {
        try
        {
            using var client = new SmtpClient();
            
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var username = _configuration["Email:Username"];
            var password = _configuration["Email:Password"];

            if (string.IsNullOrEmpty(smtpHost))
            {
                _logger.LogWarning("Email configuration is missing. Email not sent.");
                return;
            }

            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                await client.AuthenticateAsync(username, password);
            }

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
            
            _logger.LogInformation("Email sent successfully to {Email}", message.To.First());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", message.To.First());
            throw;
        }
    }
}