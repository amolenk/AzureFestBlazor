namespace AzureFest.Web.Configuration;

public class WebsiteSettings
{
    public string CurrentEdition { get; init; } = string.Empty;
    public string PreviousEdition { get; init; } = string.Empty;
    public string PreviousEditionTitle { get; init; } = string.Empty;
    public DateOnly PreConWorkshopsDate { get; init; }
    public DateOnly ConferenceDate { get; init; }
    public bool SessionsAnnounced { get; init; }
    public bool ScheduleAnnounced { get; init; }
    public bool SpeakersAnnounced { get; init; }
    public bool TicketsAvailable { get; init; }
    public bool ConferenceTicketSaleOpened { get; init; } = true;
    public bool WorkshopTicketSaleOpened { get; init; }
    public string? SessionizeCfpLink { get; init; }
    public string? EventbriteLink { get; init; }
    public string? SessionizeApiId { get; init; }
    public List<Sponsor> GoldSponsors { get; init; } = [];
    public List<Sponsor> CommunitySponsors { get; init; } = [];
    public List<Organizer> Organizers { get; init; } = [];
}