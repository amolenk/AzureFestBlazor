namespace Bitbash.SessionizeImport.Models;

public class SessionizeCategory
{
    public int? Id { get; set; }

    public string? Title { get; set; }

    public IEnumerable<SessionizeCategoryItem> Items { get; set; } = Enumerable.Empty<SessionizeCategoryItem>();
}
