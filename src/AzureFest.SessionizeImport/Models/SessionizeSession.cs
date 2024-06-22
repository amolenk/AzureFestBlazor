namespace Bitbash.SessionizeImport.Models;

public class SessionizeSession
{
    public string? Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public bool? IsServiceSession { get; set; }

    public IEnumerable<string>? Speakers { get; set; }

    public IEnumerable<int>? CategoryItems { get; set; }

    public int? RoomId { get; set; }
}
