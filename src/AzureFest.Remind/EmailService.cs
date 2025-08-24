using System.Text.Json;
using MailKit.Security;
using MailKit.Net.Smtp;
using MimeKit;

namespace AzureFest.Remind;

public class EmailService
{
    public async Task SendReminderEmailsAsync()
    {
            using var client = new SmtpClient();

            var smtpHost = "smtp.eu.mailgun.org";
            var smtpPort = 587;
            var username = "<noreply@mg.azurefest.nl>";
            var password = "<password>";

            // TODO Should validate SMTP settings more robustly
            client.ServerCertificateValidationCallback = (s,c,h,e) => true;
            
            await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.Auto);
            
            if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
            {
                await client.AuthenticateAsync(username, password);
            }
            
            var baseUrl = "https://www.azurefest.nl";
            var hmacService = new HmacService();

            var records = JsonSerializer.Deserialize<List<EmailRecord>>(
                File.ReadAllText("/Users/amolenk/Downloads/Query1.json"));
            
            // List<EmailRecord> records =
            // [
            //     new EmailRecord(
            //         Guid.Parse("37e211d1-0f4f-9716-52c8-6793708141bb"),
            //         "mail@sandermolenkamp.com",
            //         "SanderTest",
            //         "MolenkampTest")
            // ];

            foreach (var record in records)
            {
                try
                {
                
                    var registrationSignature = hmacService.GenerateSignature(record.Id.ToString());
                    var confirmationLink = $"{baseUrl}/tickets/confirm/{record.Id}/{registrationSignature}";
                    
                    var message = CreateReminderMail(record.Email, record.FirstName, record.LastName, confirmationLink);
                
                    await client.SendAsync(message);
                
                    Console.WriteLine($"Email sent successfully to {record.Email}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to send email to {record.Email}");
                    throw;
                }
            }
            
            await client.DisconnectAsync(true);
    }
    
    public MimeMessage CreateReminderMail(string toEmail, string firstName, string lastName, string confirmationLink)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Azure Fest", "noreply@mg.azurefest.nl"));
        message.ReplyTo.Add(new MailboxAddress("Azure Fest", "team@azurefest.nl"));
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

        return message;
    }
}