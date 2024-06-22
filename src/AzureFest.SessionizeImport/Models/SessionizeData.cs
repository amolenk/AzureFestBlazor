namespace Bitbash.SessionizeImport.Models;

public class SessionizeData
{
    public IEnumerable<SessionizeSpeaker> Speakers { get; set; } = Enumerable.Empty<SessionizeSpeaker>();

    public IEnumerable<SessionizeSession> Sessions { get; set; } = Enumerable.Empty<SessionizeSession>();

    public IEnumerable<SessionizeRoom> Rooms { get; set; } = Enumerable.Empty<SessionizeRoom>();

    public IEnumerable<SessionizeCategory> Categories { get; set; } = Enumerable.Empty<SessionizeCategory>();
}
