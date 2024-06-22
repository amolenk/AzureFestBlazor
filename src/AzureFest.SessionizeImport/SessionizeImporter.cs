using System.Net.Http.Json;
using System.Text.Json;
using System.Text.RegularExpressions;
using Bitbash.Models;
using Bitbash.SessionizeImport.Models;
using Unidecode.NET;

namespace Bitbash.SessionizeImport;

public class SessionizeImporter(HttpClient httpClient)
{
    public async Task ImportAsync(string sessionizeApiId, string edition, string websitePath)
    {
        var url = $"https://sessionize.com/api/v2/{sessionizeApiId}/view/All";

        var data = await httpClient.GetFromJsonAsync<SessionizeData>(url);
        if (data == null)
        {
            throw new InvalidOperationException("Sessionize data is null.");
        }

        var importProfilePicturesTask = ImportProfilePicturesAsync(data, edition, websitePath);

        ImportMetadata(data, edition, websitePath);

        await importProfilePicturesTask;
    }

    private void ImportMetadata(SessionizeData sessionizeData, string edition, string websitePath)
    {
        Console.WriteLine($"Importing metadata for '{edition}'...");

        var speakers = sessionizeData.Speakers.ToDictionary(CreateId);
        var sessions = sessionizeData.Sessions.ToDictionary(CreateId);
        var rooms = sessionizeData.Rooms.ToDictionary(r => r.Id!.Value);

        var eventDetails = new EventDetails()
        {
            Speakers = speakers.Select(kv => new Speaker
                {
                    Id = kv.Key,
                    FullName = kv.Value.FullName,
                    Bio = kv.Value.Bio,
                    TagLine = kv.Value.TagLine,
                    IsTopSpeaker = kv.Value.IsTopSpeaker,
                    ProfilePictureUrl = $"img/{edition}/speakers/{kv.Key}{Path.GetExtension(kv.Value.ProfilePicture!)}",
                    SessionIds = kv.Value.Sessions?
                        .Select(id => sessions.First(s => s.Value.Id == id.ToString()).Key)
                }),
            Sessions = sessions.Select(kv => new Session
                {
                    Id = kv.Key,
                    Title = kv.Value.Title,
                    Description = kv.Value.Description,
                    StartsAt = kv.Value.StartsAt,
                    EndsAt = kv.Value.EndsAt,
                    IsServiceSession = kv.Value.IsServiceSession,
                    SpeakerIds = kv.Value.Speakers?
                        .Select(id => speakers.First(s => s.Value.Id == id.ToString()).Key),
                    SessionFormat = LookupCategoryItem(kv.Value.CategoryItems, "Session format", sessionizeData),
                    Level = LookupCategoryItem(kv.Value.CategoryItems, "Level", sessionizeData),
                    Room = kv.Value.RoomId.HasValue ?
                        rooms[kv.Value.RoomId!.Value].Name : null
                })
        };

        WriteJsonFile(edition, eventDetails, websitePath);
    }

    private string? LookupCategoryItem(IEnumerable<int> sessionCategoryItemIds, string categoryName, SessionizeData sessionizeData)
    {
        var category = sessionizeData.Categories.FirstOrDefault(c => c.Title == categoryName);
        if (category is not null)
        {
            foreach (var sessionCategoryItemId in sessionCategoryItemIds)
            {
                var categoryItem = category.Items.FirstOrDefault(i => i.Id == sessionCategoryItemId);
                if (categoryItem is not null)
                {
                    return categoryItem.Name;
                }
            }
        }

        return null;
    }

    private async Task ImportProfilePicturesAsync(SessionizeData sessionizeData, string edition, string websitePath)
    {
        foreach (var speaker in sessionizeData.Speakers)
        {
            if (speaker.ProfilePicture is not null)
            {
                await ImportProfilePictureAsync(
                    CreateId(speaker),
                    speaker.ProfilePicture!,
                    edition,
                    websitePath);
            }
        }
    }

    private async Task ImportProfilePictureAsync(string speakerId, string url, string edition, string websitePath)
    {        
        Console.WriteLine($"Importing profile picture for '{speakerId}'...");

        var httpResult = await httpClient.GetAsync(url);
        using var resultStream = await httpResult.Content.ReadAsStreamAsync();

        var outputFolder = Path.Combine(
            websitePath,
            $"wwwroot/img/{edition}/speakers/");

        if (!Directory.Exists(outputFolder))
        {
            Directory.CreateDirectory(outputFolder);
        }

        var outputPath = Path.Combine(
            outputFolder,
            speakerId + Path.GetExtension(url));
        
        using var fileStream = File.Create(outputPath);
        resultStream.CopyTo(fileStream);
    }

    private string CreateId(SessionizeSpeaker speaker)
        => CreateId(speaker.FullName!);

    private string CreateId(SessionizeSession session)
    {
        if (session.IsServiceSession is bool serviceSession && serviceSession)
        {
            return Guid.NewGuid().ToString("D");
        }

        return CreateId(session.Title!);
    }

    private string CreateId(string value)
    {
        value = value.Unidecode().ToLowerInvariant();
        value = Regex.Replace(value, @"[^a-z0-9\s]+", string.Empty);
        value = Regex.Replace(value, @"\s+", "-");

        return value;
    }

    private void  WriteJsonFile<T>(string name, T value, string websitePath)
    {
        var jsonOptions = new JsonSerializerOptions
        {
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(value, jsonOptions);

        var outputPath = Path.Combine(websitePath, $"wwwroot/data/{name}.json");
        File.WriteAllText(outputPath, json);
    }
}
