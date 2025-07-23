namespace AzureFest.Remind;

public record EmailRecord(
    Guid Id,
    string Email,
    string FirstName,
    string LastName);
