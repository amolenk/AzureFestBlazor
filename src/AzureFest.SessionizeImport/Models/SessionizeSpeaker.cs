namespace Bitbash.SessionizeImport.Models;

public class SessionizeSpeaker
{
    public string? Id { get; set; }

    public string? FullName { get; set; }

    public string? Bio { get; set; }

    public string? TagLine { get; set; }

    public string? ProfilePicture { get; set; }

    public bool? IsTopSpeaker { get; set; }

    public IEnumerable<int>? Sessions { get; set; }
}
