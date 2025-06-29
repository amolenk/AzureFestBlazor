using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AzureFest.Web.Services;

public interface IEmailService
{
    Task SendConfirmationEmailAsync(string toEmail, string firstName, string confirmationLink, string cancellationLink);
    Task SendTicketEmailAsync(string toEmail, string firstName, string qrCodeBase64, string cancellationLink);
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

    public async Task SendConfirmationEmailAsync(string toEmail, string firstName, string confirmationLink, string cancellationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@azurefest.nl"));
        message.To.Add(new MailboxAddress(firstName, toEmail));
        message.Subject = "Confirm your Azure Fest registration";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{{{
                            font-family: 'Segoe UI', 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
                            line-height: 1.6;
                            color: #2f3138;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }}}}
                        h2 {{{{
                            font-family: 'Segoe UI', 'Arial', sans-serif;
                            color: #0e1b4d;
                            margin-bottom: 20px;
                        }}}}
                        .button {{{{
                            display: inline-block;
                            background-color: #E74C3C;
                            color: white;
                            padding: 12px 24px;
                            text-decoration: none;
                            border-radius: 25px;
                            font-weight: bold;
                            margin: 20px 0;
                        }}}}
                        .button:hover {{{{
                            background-color: #f8234a;
                        }}}}
                        .footer {{{{
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 12px;
                            color: #666;
                        }}}}
                    </style>
                </head>
                <body>
                    <h2>Welcome to Azure Fest!</h2>
                    <p>Hi {firstName},</p>
                    <p>Thank you for registering for Azure Fest. Please confirm your registration by clicking the button below:</p>
                    <p><a href=""{confirmationLink}"" class=""button"">Confirm Registration</a></p>
                    <p>If you can't click the button, copy and paste this URL into your browser:</p>
                    <p style=""word-break: break-all; font-size: 12px; color: #666;"">{confirmationLink}</p>
                    <div class=""footer"">
                        <p>If you want to cancel your registration, you can do so by clicking <a href=""{cancellationLink}"">here</a>.</p>
                        <p>We look forward to seeing you at Azure Fest!</p>
                        <p>Best regards,<br>The Azure Fest Team</p>
                    </div>
                </body>
                </html>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(message);
    }

    public async Task SendTicketEmailAsync(string toEmail, string firstName, string qrCodeBase64, string cancellationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@azurefest.nl"));
        message.To.Add(new MailboxAddress(firstName, toEmail));
        message.Subject = "Your Azure Fest ticket";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{{{
                            font-family: 'Segoe UI', 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
                            line-height: 1.6;
                            color: #2f3138;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }}}}
                        h2 {{{{
                            font-family: 'Segoe UI', 'Arial', sans-serif;
                            color: #0e1b4d;
                            margin-bottom: 20px;
                        }}}}
                        .qr-container {{{{
                            text-align: center;
                            margin: 30px 0;
                            padding: 20px;
                            background-color: #f8f9fa;
                            border-radius: 10px;
                        }}}}
                        .qr-code {{{{
                            max-width: 200px;
                            height: auto;
                            border: 2px solid #ddd;
                            border-radius: 10px;
                            padding: 10px;
                            background: white;
                        }}}}
                        .footer {{{{
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 12px;
                            color: #666;
                        }}}}
                    </style>
                </head>
                <body>
                    <h2>Your Azure Fest Ticket</h2>
                    <p>Hi {firstName},</p>
                    <p>Your registration has been confirmed! Here's your ticket for Azure Fest:</p>
                    <div class=""qr-container"">
                        <img src=""data:image/png;base64,{qrCodeBase64}"" alt=""Your QR Code Ticket"" class=""qr-code"" />
                        <p style=""margin-top: 15px; font-size: 14px; color: #666;"">Show this QR code at the event</p>
                    </div>
                    <p>Please bring this QR code with you to the event. You can either print this email or show it on your mobile device.</p>
                    <div class=""footer"">
                        <p>If you need to cancel your registration, you can do so by clicking <a href=""{cancellationLink}"">here</a>.</p>
                        <p>We look forward to seeing you at Azure Fest!</p>
                        <p>Best regards,<br>The Azure Fest Team</p>
                    </div>
                </body>
                </html>"
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

            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.Auto);
            
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