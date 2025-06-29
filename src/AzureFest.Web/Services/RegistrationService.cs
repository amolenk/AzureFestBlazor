using AzureFest.Models;
using AzureFest.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace AzureFest.Web.Services;

public interface IRegistrationService
{
    Task<(bool Success, string? ErrorMessage)> RegisterAsync(string email, string firstName, string lastName, string? companyName);
    Task<(bool Success, string? ErrorMessage)> ConfirmRegistrationAsync(string confirmationToken);
    Task<(bool Success, string? ErrorMessage)> CancelRegistrationAsync(string registrationId, string signature);
    Task<Registration?> GetRegistrationByEmailAsync(string email);
    Task<Registration?> GetRegistrationByIdAsync(string registrationId);
}

public class RegistrationService : IRegistrationService
{
    private readonly TicketingDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IQrCodeService _qrCodeService;
    private readonly IHmacService _hmacService;
    private readonly ILogger<RegistrationService> _logger;
    private readonly IConfiguration _configuration;

    public RegistrationService(
        TicketingDbContext context,
        IEmailService emailService,
        IQrCodeService qrCodeService,
        IHmacService hmacService,
        ILogger<RegistrationService> logger,
        IConfiguration configuration)
    {
        _context = context;
        _emailService = emailService;
        _qrCodeService = qrCodeService;
        _hmacService = hmacService;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<(bool Success, string? ErrorMessage)> RegisterAsync(string email, string firstName, string lastName, string? companyName)
    {
        try
        {
            // Check if registration already exists
            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Email == email && !r.IsCancelled);

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
            var cancellationSignature = _hmacService.GenerateSignature(existingRegistration.Id.ToString());
            var cancellationLink = $"{baseUrl}/tickets/cancel/{existingRegistration.Id}/{cancellationSignature}";
            await _emailService.SendConfirmationEmailAsync(email, firstName, confirmationLink, cancellationLink);

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
                .FirstOrDefaultAsync(r => r.ConfirmationToken == confirmationToken && !r.IsConfirmed && !r.IsCancelled);

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
            var baseUrl = _configuration["BaseUrl"] ?? "https://azurefest.nl";
            var cancellationSignature = _hmacService.GenerateSignature(registration.Id.ToString());
            var cancellationLink = $"{baseUrl}/tickets/cancel/{registration.Id}/{cancellationSignature}";
            await _emailService.SendTicketEmailAsync(registration.Email, registration.FirstName, qrCodeBase64, cancellationLink);

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
            .FirstOrDefaultAsync(r => r.Email == email && !r.IsCancelled);
    }

    public async Task<Registration?> GetRegistrationByIdAsync(string registrationId)
    {
        if (!Guid.TryParse(registrationId, out var id))
        {
            return null;
        }

        return await _context.Registrations
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsCancelled);
    }

    public async Task<(bool Success, string? ErrorMessage)> CancelRegistrationAsync(string registrationId, string signature)
    {
        try
        {
            // Validate HMAC signature
            if (!_hmacService.ValidateSignature(registrationId, signature))
            {
                _logger.LogWarning("Invalid HMAC signature for cancellation attempt on registration {RegistrationId}", registrationId);
                return (false, "Invalid cancellation link.");
            }

            // Find the registration
            var registration = await GetRegistrationByIdAsync(registrationId);
            if (registration == null)
            {
                return (false, "Registration not found or already cancelled.");
            }

            // Cancel the registration
            registration.IsCancelled = true;
            registration.CancelledAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            _logger.LogInformation("Registration cancelled for {Email} (ID: {RegistrationId})", registration.Email, registrationId);
            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling registration {RegistrationId}", registrationId);
            return (false, "An error occurred while cancelling your registration. Please try again.");
        }
    }
}