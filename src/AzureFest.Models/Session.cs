using System.Text.Json.Serialization;

namespace AzureFest.Models;

public class Session
{
    public string? Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime? StartsAt { get; set; }

    public DateTime? EndsAt { get; set; }

    public bool? IsServiceSession { get; set; }

    [JsonPropertyName("speakers")]
    public IEnumerable<string>? SpeakerIds { get; set; } = Enumerable.Empty<string>();

    [JsonIgnore]
    public List<Speaker> Speakers { get; set; } = new();

    public string? SessionFormat { get; set; }

    public string? Level { get; set; }

    public string? Room { get; set; }
}
