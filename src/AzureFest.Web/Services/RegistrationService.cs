using AzureFest.Models;
using AzureFest.Web.Data;
using Microsoft.EntityFrameworkCore;

namespace AzureFest.Web.Services;

public interface IRegistrationService
{
    Task<(bool Success, string? ErrorMessage)> RegisterAsync(string email, string firstName, string lastName, string? companyName);
    Task<(bool Success, string? ErrorMessage)> ConfirmRegistrationAsync(string registrationId, string signature);
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
            // Generate deterministic GUID based on email
            var registrationId = DeterministicGuidGenerator.Generate(email);
            
            // Check if registration already exists (including cancelled ones)
            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.Id == registrationId);

            if (existingRegistration != null)
            {
                if (existingRegistration.IsConfirmed && !existingRegistration.IsCancelled)
                {
                    return (false, "A confirmed registration already exists for this email address.");
                }

                // Update existing registration (whether pending or cancelled)
                existingRegistration.FirstName = firstName;
                existingRegistration.LastName = lastName;
                existingRegistration.CompanyName = companyName;
                existingRegistration.CreatedAt = DateTime.UtcNow;
                existingRegistration.IsConfirmed = false; // Reset confirmation status
                existingRegistration.IsCancelled = false; // Reset cancellation status
                existingRegistration.CancelledAt = null; // Clear cancellation date
            }
            else
            {
                // Create new registration
                existingRegistration = new Registration
                {
                    Id = registrationId,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    CompanyName = companyName
                };

                _context.Registrations.Add(existingRegistration);
            }

            await _context.SaveChangesAsync();

            // Send confirmation email with HMAC signature
            var baseUrl = _configuration["BaseUrl"] ?? "https://azurefest.nl";
            var confirmationSignature = _hmacService.GenerateSignature(registrationId.ToString());
            var confirmationLink = $"{baseUrl}/tickets/confirm/{registrationId}/{confirmationSignature}";
            var cancellationSignature = _hmacService.GenerateSignature(registrationId.ToString());
            var cancellationLink = $"{baseUrl}/tickets/cancel/{registrationId}/{cancellationSignature}";
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

    public async Task<(bool Success, string? ErrorMessage)> ConfirmRegistrationAsync(string registrationId, string signature)
    {
        try
        {
            // Validate HMAC signature
            if (!_hmacService.ValidateSignature(registrationId, signature))
            {
                _logger.LogWarning("Invalid HMAC signature for confirmation attempt on registration {RegistrationId}", registrationId);
                return (false, "Invalid confirmation link.");
            }

            // Find the registration
            var registration = await GetRegistrationByIdAsync(registrationId);
            if (registration == null)
            {
                return (false, "Registration not found.");
            }

            if (registration.IsConfirmed)
            {
                return (false, "Registration has already been confirmed.");
            }

            if (registration.IsCancelled)
            {
                return (false, "This registration has been cancelled.");
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
            _logger.LogError(ex, "Error confirming registration with ID {RegistrationId}", registrationId);
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