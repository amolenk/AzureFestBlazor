using System.Collections.Concurrent;
using System.Text.Json;
using AzureFest.Models;

namespace AzureFest.Web.Services;

public class EventDetailsProvider
{
    private readonly ConcurrentDictionary<string, Task<EventDetails>> _eventDetailTasks = new();
    
    public async Task<IEnumerable<Speaker>> GetSpeakersAsync(string edition)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Speakers
            .OrderBy(s => s.IsTopSpeaker)
            .ThenBy(s => s.FullName);
    }

    public async Task<Speaker?> GetSpeakerAsync(string edition, string speakerId)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Speakers.FirstOrDefault(s => s.Id == speakerId);
    }

    public async Task<IEnumerable<DateOnly>> GetEventDatesAsync(string edition)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Sessions
            .Where(s => s.StartsAt is not null)
            .GroupBy(s => s.StartsAt!.Value)
            .Select(g => DateOnly.FromDateTime(g.Key))
            .Distinct()
            .OrderBy(d => d);
    }

    public async Task<IEnumerable<IGrouping<DateTime, Session>>> GetScheduleAsync(string edition)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Sessions
            .GroupBy(s => s.StartsAt!.Value)
            .OrderBy(g => g.Key);
    }
    
    public async Task<IEnumerable<Session>> GetUpNextAsync(string edition, DateTime time)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        var sessionsByUpNextTime = eventDetails.Sessions
            .Where(s => s.StartsAt is not null && s.IsServiceSession is false)
            .GroupBy(s => s.StartsAt!.Value + (s.EndsAt - s.StartsAt) / 2)
            .OrderBy(g => g.Key)
            .ToList();
        
        var upNext = sessionsByUpNextTime
            .FirstOrDefault(g => g.Key > time);

        return upNext ?? sessionsByUpNextTime.Last();
    }

    public async Task<IEnumerable<IGrouping<DateTime, Session>>> GetUpNextTestSessionsAsync(string edition)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Sessions
            .Where(s => s.StartsAt is not null && s.IsServiceSession is false)
            .GroupBy(s => s.StartsAt!.Value)
            .OrderBy(g => g.Key)
            .ToList();
    }

    public async Task<Session?> GetSessionAsync(string edition, string sessionId)
    {
        var eventDetails = await GetEventDetailsAsync(edition);

        return eventDetails.Sessions.FirstOrDefault(s => s.Id == sessionId);
    }
    
    private Task<EventDetails> GetEventDetailsAsync(string edition)
    {
        if (_eventDetailTasks.TryGetValue(edition, out var task))
        {
            return task;
        }

        return _eventDetailTasks.GetOrAdd(edition, GetEventDetailsCoreAsync(edition));
    }
    
    private async Task<EventDetails> GetEventDetailsCoreAsync(string edition)
    {
        var path = $"Data/{edition}/event-details.json";

        EventDetails? eventDetails;
        
        await using (var stream = File.OpenRead(path))
        {
            eventDetails = await JsonSerializer.DeserializeAsync<EventDetails>(stream);
            eventDetails ??= new EventDetails();
        }
        
        // Enrich data with cross-references.
        foreach (var speaker in eventDetails.Speakers)
        {
            foreach (var sessionId in speaker.SessionIds)
            {
                var session = eventDetails.Sessions.FirstOrDefault(s => s.Id == sessionId);
                if (session is null) continue;
                speaker.Sessions.Add(session);
                session.Speakers.Add(speaker);
            }
        }

        return eventDetails;
    }
}