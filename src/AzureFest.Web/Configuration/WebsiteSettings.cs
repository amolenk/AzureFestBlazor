namespace AzureFest.Web.Configuration;

public class WebsiteSettings
{
    public string CurrentEdition { get; init; } = string.Empty;
    public bool SessionsAnnounced { get; init; }
    public bool ScheduleAnnounced { get; init; }
    public bool SpeakersAnnounced { get; init; }
    public bool TicketsAvailable { get; init; }
    public string? SessionizeCfpLink { get; init; }
    public string? EventbriteLink { get; init; }
    public List<Sponsor> GoldSponsors { get; init; } = [];
    public List<Sponsor> CommunitySponsors { get; init; } = [];
    public List<Organizer> Organizers { get; init; } = [];
}