using System.ComponentModel.DataAnnotations;

namespace AzureFest.Models;

public class Registration
{
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    public string EmploymentStatus { get; set; } = string.Empty;
    
    public string? CompanyName { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsConfirmed { get; set; } = false;
    
    public DateTime? ConfirmedAt { get; set; }
    
    public bool IsCancelled { get; set; } = false;
    
    public DateTime? CancelledAt { get; set; }
    
    public bool IsReconfirmed { get; set; } = false;
    
    public DateTime? ReconfirmMailSentAt { get; set; }

    public DateTime? ReconfirmedAt { get; set; }
    
    public DateTime? CheckedInAt { get; set; }
}