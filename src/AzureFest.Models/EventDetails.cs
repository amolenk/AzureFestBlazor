namespace AzureFest.Models;

public class EventDetails
{
    public IEnumerable<Speaker> Speakers { get; set; } = Enumerable.Empty<Speaker>();

    public IEnumerable<Session> Sessions { get; set; } = Enumerable.Empty<Session>();
}
