using AzureFest.Models;
using AzureFest.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace AzureFest.Web.Services;

public interface IRegistrationService
{
    Task<(bool Success, string? ErrorMessage)> RegisterAsync(string email, string firstName, string lastName, string? companyName);
    Task<(bool Success, string? ErrorMessage)> ConfirmRegistrationAsync(string confirmationToken);
    Task<Registration?> GetRegistrationByEmailAsync(string email);
}

public class RegistrationService : IRegistrationService
{
    private readonly TicketingDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IQrCodeService _qrCodeService;
    private readonly ILogger<RegistrationService> _logger;
    private readonly IConfiguration _configuration;

    public RegistrationService(
        TicketingDbContext context,
        IEmailService emailService,
        IQrCodeService qrCodeService,
        ILogger<RegistrationService> logger,
        IConfiguration configuration)
    {
        _context = context;
        _emailService = emailService;
        _qrCodeService = qrCodeService;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<(bool Success, string? ErrorMessage)> RegisterAsync(string email, string firstName, string lastName, string? companyName)
    {
        try
        {
            // Check if registration already exists
            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Email == email);

            if (existingRegistration != null)
            {
                if (existingRegistration.IsConfirmed)
                {
                    return (false, "A confirmed registration already exists for this email address.");
                }

                // Update existing pending registration
                existingRegistration.FirstName = firstName;
                existingRegistration.LastName = lastName;
                existingRegistration.CompanyName = companyName;
                existingRegistration.CreatedAt = DateTime.UtcNow;
                existingRegistration.ConfirmationToken = Guid.NewGuid().ToString();
            }
            else
            {
                // Create new registration
                existingRegistration = new Registration
                {
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    CompanyName = companyName,
                    ConfirmationToken = Guid.NewGuid().ToString()
                };

                _context.Registrations.Add(existingRegistration);
            }

            await _context.SaveChangesAsync();

            // Send confirmation email
            var baseUrl = _configuration["BaseUrl"] ?? "https://azurefest.nl";
            var confirmationLink = $"{baseUrl}/tickets/confirm/{existingRegistration.ConfirmationToken}";
            await _emailService.SendConfirmationEmailAsync(email, firstName, confirmationLink);

            _logger.LogInformation("Registration created/updated for {Email}", email);
            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user {Email}", email);
            return (false, "An error occurred while processing your registration. Please try again.");
        }
    }

    public async Task<(bool Success, string? ErrorMessage)> ConfirmRegistrationAsync(string confirmationToken)
    {
        try
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.ConfirmationToken == confirmationToken && !r.IsConfirmed);

            if (registration == null)
            {
                return (false, "Invalid or expired confirmation token.");
            }

            // Confirm the registration
            registration.IsConfirmed = true;
            registration.ConfirmedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            // Generate QR code with registration ID
            var qrCodeContent = registration.Id.ToString();
            var qrCodeBase64 = _qrCodeService.GenerateQrCodeBase64(qrCodeContent);

            // Send ticket email
            await _emailService.SendTicketEmailAsync(registration.Email, registration.FirstName, qrCodeBase64);

            _logger.LogInformation("Registration confirmed for {Email}", registration.Email);
            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming registration with token {Token}", confirmationToken);
            return (false, "An error occurred while confirming your registration. Please try again.");
        }
    }

    public async Task<Registration?> GetRegistrationByEmailAsync(string email)
    {
        return await _context.Registrations
            .FirstOrDefaultAsync(r => r.Email == email);
    }
}