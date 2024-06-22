using System.Text.Json.Serialization;

namespace AzureFest.Models;

public class Speaker
{
    public string? Id { get; set; }

    public string? FullName { get; set; }

    public string? Bio { get; set; }

    public string? TagLine { get; set; }

    public bool? IsTopSpeaker { get; set; }

    public string? ProfilePictureUrl { get; set; }

    [JsonPropertyName("sessions")]
    public IEnumerable<string> SessionIds { get; set; } = Enumerable.Empty<string>();

    [JsonIgnore]
    public List<Session> Sessions { get; set; } = new();
}
