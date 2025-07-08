using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace AzureFest.Web.Services;

public interface IEmailService
{
    Task SendRequestForConfirmationEmailAsync(string toEmail, string firstName, string lastName, string confirmationLink, string cancellationLink);
    Task SendTicketEmailAsync(string toEmail, string firstName, string lastName, string qrCodeLink, string cancellationLink);
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

    public async Task SendRequestForConfirmationEmailAsync(string toEmail, string firstName, string lastName, string confirmationLink, string cancellationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@mg.azurefest.nl"));
        message.ReplyTo.Add(new MailboxAddress("Azure Fest", _configuration["Email:ReplyToAddress"] ?? "team@azurefest.nl"));
        message.To.Add(new MailboxAddress($"{firstName} {lastName}", toEmail));
        message.Subject = "Confirm your Azure Fest registration";
        
        // To avoid blue button links in Gmail, we also apply styles directly to the button
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                <style type=""text/css"">
                    @font-face {{
                        font-family: 'Lobster Two';
                        font-style: normal;
                        font-weight: 400;
                        src: local('Lobster Two'), url('https://fonts.gstatic.com/s/lobstertwo/v24/BngMUXZGTXPUvIoyV6yN5-fI.woff2') format('woff2');
                    }}
                    body {{
                        font-family: 'Segoe UI', 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
                        line-height: 1.6;
                        color: #2f3138 !important;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    p {{
                        color: #2f3138 !important;
                    }}
                    h2 {{
                        font-family: 'Lobster Two', 'Segoe UI', 'Arial', sans-serif;
                        font-size: 26px;
                        color: #0e1b4d;
                        margin-bottom: 20px;
                    }}
                    .button {{
                        display: inline-block;
                        background-color: #E74C3C;
                        color: white;
                        padding: 12px 20px;
                        text-decoration: none;
                        border-radius: 25px;
                        font-weight: bold;
                        margin: 20px 0;
                    }}
                    .button:hover {{
                        background-color: #2986cc;
                    }}
                    .confirm-url {{
                        word-break: break-all;
                        font-size: 14px;
                        color: #666;
                    }}
                    .confirm-info {{
                        padding-left: 18px;
                    }}
                    .footer {{
                        border-top: 1px solid #eee;
                        border-bottom: 1px solid #eee;
                    }}
                </style>
            </head>
            <body>
                <h2>Confirm Your Azure Fest Registration</h2>
                <p>Hi {firstName},</p>
                <p>Thank you for your interest in attending Azure Fest! Please note that your registration is <strong>not yet final</strong>.</p>
                <p>To secure your spot, you must confirm your registration. Before doing so, please read this important information:</p>    
                <ul class=""confirm-info"">
                    <li>Azure Fest is a free event, but places are limited. Please only confirm if you genuinely intend to attend.</li>
                    <li>If you are unable to make it, we kindly ask you to cancel your ticket in advance or notify the organization, so someone else can take your place.</li>
                    <li>No-shows or late cancellations prevent others from joining and may impact your ability to attend future events.</li>
                </ul>
                <p>If you agree to these house rules, confirm your registration by clicking the button below:</p>
                <p><a href=""{confirmationLink}""
                        class=""button""
                        style=""background-color:#E74C3C !important;color:#fff !important;display:inline-block;padding:12px 20px;text-decoration:none;border-radius:25px;font-weight:bold;margin:20px 0;font-family:'Segoe UI','Arial','Helvetica Neue','Helvetica',sans-serif;"">Confirm My Registration</a></p>
                <div class=""footer"">
                    <p>If the button above does not work, please copy and paste this URL into your browser:</p>
                    <p class=""confirm-url"">{confirmationLink}</p>
                </div>
                <p>We look forward to welcoming you at Azure Fest!</p>
                <p>Best regards,<br>The Azure Fest Team</p>
            </body>
            </html>"
        };

        message.Body = bodyBuilder.ToMessageBody();

        await SendEmailAsync(message);
    }

    public async Task SendTicketEmailAsync(string toEmail, string firstName, string lastName, string qrCodeLink, string cancellationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", _configuration["Email:FromAddress"] ?? "noreply@mg.azurefest.nl"));
        message.ReplyTo.Add(new MailboxAddress("Azure Fest", _configuration["Email:ReplyToAddress"] ?? "team@azurefest.nl"));
        message.To.Add(new MailboxAddress($"{firstName} {lastName}", toEmail));
        message.Subject = "Your Azure Fest ticket";

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                    <head>
                        <style>
                            @font-face {{
                                font-family: 'Lobster Two';
                                font-style: normal;
                                font-weight: 400;
                                src: local('Lobster Two'), url('https://fonts.gstatic.com/s/lobstertwo/v24/BngMUXZGTXPUvIoyV6yN5-fI.woff2') format('woff2');
                            }}
                            body {{
                                font-family: 'Segoe UI', 'Arial', 'Helvetica Neue', 'Helvetica', sans-serif;
                                line-height: 1.6;
                                color: #2f3138 !important;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                            }}
                            p {{
                                color: #2f3138 !important;
                            }}
                            h2 {{
                                font-family: 'Lobster Two', 'Segoe UI', 'Arial', sans-serif;
                                font-size: 26px;
                                color: #0e1b4d;
                                margin-bottom: 20px;
                            }}
                            .qr-container {{
                                text-align: center;
                                margin: 30px 0;
                                padding: 20px;
                                background-color: #f8f9fa;
                                border-radius: 10px;
                            }}
                            /* .qr-code {{
                                max-width: 200px;
                                height: auto;
                                border: 2px solid #ddd;
                                border-radius: 10px;
                                padding: 10px;
                                background: white;
                            }} */
                            .footer {{
                                border-top: 1px solid #eee;
                                border-bottom: 1px solid #eee;            
                            }}
                        </style>
                    </head>
                    <body>
                        <h2>Your Azure Fest Ticket</h2>
                        <p>Hi {firstName},</p>
                        <p>Your registration has been confirmed! Here's your ticket for Azure Fest:</p>
                        <div class=""qr-container"">
                            <img src=""{qrCodeLink}""
                                alt=""Your QR Code Ticket""
                                width=""200""
                                height=""200""
                                style=""display:block;width:200px;height:200px;max-width:200px;border:2px solid #ddd;border-radius:10px;padding:10px;background:#fff;margin:0 auto;"" />
                            <p style=""margin-top: 15px; font-size: 14px; color: #666;"">Show this QR code at the event</p>
                        </div>
                        <p>Please bring this QR code with you to the event. You can either print this email or show it on your mobile device.</p>
                        <div class=""footer"">
                            <p style=""font-size:14px;color:#0e1b4d;font-weight:bold;margin-bottom:10px;"">
                            Please remember: If you can’t make it, cancel your ticket in advance!
                            </p>
                            <p>You can cancel your registration by clicking <a href=""{cancellationLink}"">here</a>. This allows us to offer your spot to someone else who would love to join. Thank you for helping us make Azure Fest a great experience for everyone!</p>
                        </div>
                        <p>For more information on speakers, sessions and location, visit <a href=""https://www.azurefest.nl"" target=""_blank"" style=""color:#0e1b4d;text-decoration:underline;"">azurefest.nl</a>.</p>
                        <p>We look forward to seeing you at Azure Fest!</p>
                        <p>Best regards,<br>The Azure Fest Team</p>
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
            var username = _configuration["Email:SmtpUsername"];
            var password = _configuration["Email:SmtpPassword"];

            if (string.IsNullOrEmpty(smtpHost))
            {
                _logger.LogWarning("Email configuration is missing. Email not sent.");
                return;
            }

            // TODO Should validate SMTP settings more robustly
            client.ServerCertificateValidationCallback = (s,c,h,e) => true;
            
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