namespace AzureFest.Web.Configuration;

public class WebsiteSettings
{
    public string CurrentEdition { get; init; } = string.Empty;
    public string PreviousEdition { get; init; } = string.Empty;
    public string PreviousEditionTitle { get; init; } = string.Empty;
    public DateOnly PreConWorkshopsDate { get; init; }
    public DateOnly ConferenceDate { get; init; }
    public bool AgendaAnnounced { get; init; } = false;
    public bool SpeakersAnnounced { get; init; } = false;
    public bool ConferenceTicketSaleOpened { get; init; } = true;
    public bool WorkshopTicketSaleOpened { get; init; } = false;
    public string? SessionizeCfpLink { get; init; }
    public string? EventbriteLink { get; init; }
    public string? HubSpotRegion { get; init; }
    public string? HubSpotPortalId { get; init; }
    public string? HubSpotConferenceTicketFormId { get; init; }
    public List<Sponsor> Sponsors { get; init; } = [];
}