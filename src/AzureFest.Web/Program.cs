using AzureFest.Models;
using AzureFest.Web.Components;
using AzureFest.Web.Configuration;
using AzureFest.Web.Services;
using AzureFest.Web.Data;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents();

var settings = builder.Configuration.GetRequiredSection("AzureFest").Get<WebsiteSettings>()!;
builder.Services.AddSingleton(settings);

builder.Services.AddSingleton<EventDetailsProvider>();

// Add database context
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<TicketingDbContext>(options =>
        options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
}
else
{
    builder.Services.AddDbContext<TicketingDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
}

// Add services
builder.Services.AddScoped<IHmacService, HmacService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IQrCodeService, QrCodeService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();

var app = builder.Build();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TicketingDbContext>();
    // context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapGet(
    "/api/qrcode/{registrationId:guid}/{registrationSignature}",
    (Guid registrationId, string registrationSignature, IHmacService hmacService, IQrCodeService qrCodeService) =>
    {
        if (!hmacService.ValidateSignature(registrationId.ToString(), registrationSignature))
        {
            return Results.Unauthorized();
        }

        var qrBytes =
            qrCodeService.GenerateQrCode($"registrationId={registrationId}&signature={registrationSignature}");
        return Results.File(qrBytes, "image/png");
    });

app.MapPost(
    "/api/qrscan/{scanResult}/{secret}",
    async (
        string scanResult,
        string secret,
        IConfiguration configuration,
        IHmacService hmacService,
        TicketingDbContext dbContext) =>
    {
        var requiredSecret = configuration["QrScanSecret"];
        if (string.IsNullOrWhiteSpace(secret) || secret != requiredSecret)
        {
            return Results.Unauthorized();
        }

        var payloadParts = QueryHelpers.ParseQuery(scanResult);
        var registrationId = payloadParts.TryGetValue("registrationId", out var rid) ? rid.ToString() : null;
        var signature = payloadParts.TryGetValue("signature", out var sig) ? sig.ToString() : null;

        if (string.IsNullOrEmpty(registrationId)
            || string.IsNullOrEmpty(signature)
            || !hmacService.ValidateSignature(registrationId, signature))
        {
            return Results.Ok(
                new ScanResponse(
                    false,
                    Error: "Invalid QR code, if you're sure this is a valid code, try scanning it again."));
        }

        var registration = await dbContext.Registrations.FindAsync([Guid.Parse(registrationId)]);
        if (registration == null)
        {
            return Results.Ok(
                new ScanResponse(
                    false,
                    Error: "Registration not found."));
        }

        registration.CheckedInAt = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();

        return Results.Ok(
            new ScanResponse(
                true,
                registration.FirstName,
                registration.LastName,
                GetStatus(registration)));
    });

// // Disable caching for HTML responses
// app.Use(async (ctx, next) =>
// {
//     await next();
//     if (ctx.Response.ContentType?.StartsWith("text/html") == true)
//     {
//         ctx.Response.Headers.CacheControl = "no-store";
//         ctx.Response.Headers.Pragma = "no-cache";
//     }
// });

// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>();

app.Run();

string GetStatus(Registration registration)
{
    if (registration.CheckedInAt is not null)
    {
        return "Already Checked In";
    }

    if (registration.IsCancelled)
    {
        return "Cancelled";
    }

    return registration.IsConfirmed ? "Confirmed" : "Did Not Complete Registration";
}

record ScanResponse(
    bool Success,
    string? FirstName = null,
    string? LastName = null,
    string? Status = null,
    string? Error = null);