using AzureFest.Web.Components;
using AzureFest.Web.Configuration;
using AzureFest.Web.Services;
using AzureFest.Web.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

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
    context.Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapGet("/api/qrcode/{registrationId:guid}/{registrationSignature}", (Guid registrationId, string registrationSignature, IHmacService hmacService, IQrCodeService qrCodeService) =>
{
    if (!hmacService.ValidateSignature(registrationId.ToString(), registrationSignature))
    {
        return Results.Unauthorized();
    }

    var qrBytes = qrCodeService.GenerateQrCode($"registrationId={registrationId}&signature={registrationSignature}");
    return Results.File(qrBytes, "image/png");
});

// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();