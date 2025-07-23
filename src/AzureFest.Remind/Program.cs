// See https://aka.ms/new-console-template for more information

var emailService = new AzureFest.Remind.EmailService();
await emailService.SendReminderEmailsAsync();
